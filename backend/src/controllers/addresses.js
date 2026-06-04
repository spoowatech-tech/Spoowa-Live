import { createAddress, findAddressesByUserId, deleteAddress as deleteAddressModel } from '../models/Address.js';

/**
 * GET /api/addresses
 */
export async function getAddresses(req, res) {
  const addresses = await findAddressesByUserId(req.user.id);
  res.json({ addresses });
}

/**
 * POST /api/addresses
 * Body: { label, fullName, phone, addressLine, city, state, pinCode, isDefault }
 */
export async function addAddress(req, res) {
  const { label, fullName, phone, addressLine, city, state, pinCode, isDefault } = req.body;

  if (!fullName || !addressLine || !city || !state || !pinCode) {
    return res.status(400).json({ error: 'fullName, addressLine, city, state, and pinCode are required.' });
  }

  const address = await createAddress(req.user.id, { label, fullName, phone, addressLine, city, state, pinCode, isDefault });

  res.status(201).json({ message: 'Address added.', address });
}

/**
 * DELETE /api/addresses/:id
 */
export async function deleteAddress(req, res) {
  const deleted = await deleteAddressModel(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Address not found.' });
  }
  res.json({ message: 'Address deleted.' });
}
