import bcrypt from 'bcryptjs';
import { createApplication, findApplicationById, findAllApplications, updateApplicationStatus, findPendingApplicationByEmail } from '../models/Application.js';
import { createUser } from '../models/User.js';
import { createTrainer } from '../models/Trainer.js';
import { createGymDistributor } from '../models/GymDistributor.js';
import { createReferralMapping, validateReferralCode } from '../models/Referral.js';
import { updateUserRole } from '../models/User.js';

/**
 * POST /api/applications/trainer
 * Submit a trainer application (public).
 */
export async function submitTrainerApplication(req, res) {
  const { name, email, mobile, address, bank_details, certification_name, certificate_number, referral_code } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Name, email, and mobile are required.' });
  }

  // Check for duplicate pending application
  const existing = await findPendingApplicationByEmail(email, 'trainer');
  if (existing) {
    return res.status(409).json({ error: 'A pending application already exists for this email.' });
  }

  // Validate referral code if provided
  if (referral_code) {
    const validation = await validateReferralCode(referral_code);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid referral code.' });
    }
  }

  const application = await createApplication({
    application_type: 'trainer',
    name,
    email,
    mobile,
    address,
    bank_details,
    certification_name,
    certificate_number,
    certificate_document: req.body.certificate_document || null,
    referral_code,
  });

  res.status(201).json({ message: 'Application submitted successfully! We will review and get back to you.', application });
}

/**
 * POST /api/applications/gym
 * Submit a gym application (public).
 */
export async function submitGymApplication(req, res) {
  const { facility_name, contact_person, email, mobile, address, bank_details, is_certified, referral_code } = req.body;

  if (!facility_name || !email || !mobile) {
    return res.status(400).json({ error: 'Facility name, email, and mobile are required.' });
  }

  const existing = await findPendingApplicationByEmail(email, 'gym');
  if (existing) {
    return res.status(409).json({ error: 'A pending application already exists for this email.' });
  }

  if (referral_code) {
    const validation = await validateReferralCode(referral_code);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid referral code.' });
    }
  }

  const application = await createApplication({
    application_type: 'gym',
    name: contact_person || facility_name,
    email,
    mobile,
    address,
    bank_details,
    facility_name,
    contact_person,
    is_certified: is_certified || false,
    certificate_document: req.body.certificate_document || null,
    referral_code,
  });

  res.status(201).json({ message: 'Application submitted successfully! We will review and get back to you.', application });
}

/**
 * GET /api/applications
 * List all applications (Super Admin only).
 */
export async function getApplications(req, res) {
  const { status, type, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  
  const result = await findAllApplications({ status, type, limit: Number(limit), offset });
  
  res.json({
    applications: result.applications,
    total: result.total,
    page: Number(page),
    limit: Number(limit),
  });
}

/**
 * PUT /api/applications/:id/review
 * Approve or reject an application (Super Admin only).
 */
export async function reviewApplication(req, res) {
  const { id } = req.params;
  const { decision, review_notes } = req.body; // decision: 'APPROVED' | 'REJECTED'
  const reviewedBy = req.user.id;

  if (!decision || !['APPROVED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ error: 'Decision must be APPROVED or REJECTED.' });
  }

  const application = await findApplicationById(id);
  if (!application) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  if (application.status !== 'PENDING') {
    return res.status(400).json({ error: 'This application has already been reviewed.' });
  }

  let createdUserId = null;

  if (decision === 'APPROVED') {
    // Create user account
    const tempPassword = `Spoowa@${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    
    const role = application.application_type === 'trainer' ? 'TRAINER_OR_RETAILER' : 'GYM_OR_AREA_DISTRIBUTOR';
    
    const user = await createUser(
      application.name,
      application.email.toLowerCase().trim(),
      hashedPassword,
      application.mobile,
      role
    );
    createdUserId = user.id;

    // Create role-specific profile
    if (application.application_type === 'trainer') {
      let gymDistId = null;
      
      // If referral code was used, link to gym distributor
      if (application.referral_code) {
        const referral = await validateReferralCode(application.referral_code);
        if (referral.valid && referral.referrer_role === 'GYM_OR_AREA_DISTRIBUTOR') {
          const { getPool } = await import('../config/db.js');
          const pool = getPool();
          const [gd] = await pool.execute('SELECT id FROM gym_distributors WHERE user_id = ?', [referral.referrer_id]);
          gymDistId = gd[0]?.id || null;
          
          // Create referral mapping
          await createReferralMapping(user.id, referral.referrer_id, referral.referrer_role, application.referral_code);
        }
      }

      await createTrainer(user.id, {
        gym_distributor_id: gymDistId,
        trainer_type: 'gym_trainer',
        certification_name: application.certification_name,
        certificate_number: application.certificate_number,
        certificate_document: application.certificate_document,
        is_verified: true,
        bank_details: application.bank_details,
      });
    } else {
      // Gym distributor
      let cityDistId = null;

      if (application.referral_code) {
        const referral = await validateReferralCode(application.referral_code);
        if (referral.valid && referral.referrer_role === 'CITY_DISTRIBUTOR') {
          const { getPool } = await import('../config/db.js');
          const pool = getPool();
          const [cd] = await pool.execute('SELECT id FROM city_distributors WHERE user_id = ?', [referral.referrer_id]);
          cityDistId = cd[0]?.id || null;
          
          await createReferralMapping(user.id, referral.referrer_id, referral.referrer_role, application.referral_code);
        }
      }

      await createGymDistributor(user.id, {
        city_distributor_id: cityDistId,
        facility_name: application.facility_name,
        contact_person: application.contact_person,
        address: application.address,
        bank_details: application.bank_details,
        is_certified: application.is_certified,
        certification_document: application.certificate_document,
      });
    }

    // Log the temporary password for dev (in production, send email)
    console.log('\n================================================');
    console.log(`  [APPLICATION APPROVED]`);
    console.log(`  Email:    ${application.email}`);
    console.log(`  Role:     ${role}`);
    console.log(`  TempPwd:  ${tempPassword}`);
    console.log('================================================\n');
  }

  await updateApplicationStatus(id, decision, reviewedBy, review_notes, createdUserId);

  res.json({ 
    message: `Application ${decision.toLowerCase()} successfully.`,
    application_id: Number(id),
    decision,
  });
}
