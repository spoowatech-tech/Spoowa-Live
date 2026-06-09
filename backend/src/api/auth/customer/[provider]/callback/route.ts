import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const provider = req.params.provider;
  const authService = req.scope.resolve(Modules.AUTH);
  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE);
  
  try {
    // 1. Validate the OAuth callback using Medusa's auth module
    const authData = {
      actor_type: "customer",
      url: req.url,
      headers: req.headers as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body as Record<string, string>,
      protocol: req.protocol,
    } as any;
    
    const response = await authService.validateCallback(provider, authData) as any;
    const { success, authIdentity, error } = response;

    if (!success || !authIdentity) {
      const errMessage = encodeURIComponent(error || "Authentication failed");
      return res.redirect(`http://localhost:5173/auth?error=${errMessage}`);
    }

    // 2. Generate a token for the customer using jsonwebtoken directly
    const { http } = config.projectConfig;
    
    // Construct the payload exactly as Medusa expects it
    const providerIdentity = authIdentity.provider_identities?.find(
      (id: any) => id.provider === provider
    );

    let customerId = authIdentity.app_metadata?.customer_id;
    const email = providerIdentity?.user_metadata?.email || (authIdentity as any).user_metadata?.email;

    // If not linked yet, check if a customer already exists with this email
    if (!customerId && email) {
      const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
      const existingCustomers = await customerModuleService.listCustomers({ email });
      
      if (existingCustomers && existingCustomers.length > 0) {
        customerId = existingCustomers[0].id;
        
        // Link the auth identity to the existing customer
        await authService.updateAuthIdentities({
          id: authIdentity.id,
          app_metadata: {
            ...(authIdentity.app_metadata || {}),
            customer_id: customerId,
          }
        });
      }
    }

    const payload = {
      actor_id: customerId || "",
      actor_type: "customer",
      auth_identity_id: authIdentity.id || "",
      auth_provider: provider,
      app_metadata: {
        ...(authIdentity.app_metadata || {}),
        customer_id: customerId,
      },
      user_metadata: providerIdentity?.user_metadata || (authIdentity as any).user_metadata || {},
    };

    const token = jwt.sign(payload, http.jwtSecret, { 
      expiresIn: http.jwtExpiresIn || "1d" 
    });

    // 3. Redirect back to the frontend AuthCallback page with the token
    const frontendUrl = `http://localhost:5173/auth/callback?token=${token}`;
    return res.redirect(frontendUrl);

  } catch (err: any) {
    const errMessage = encodeURIComponent(err.message || "An unexpected error occurred");
    return res.redirect(`http://localhost:5173/auth?error=${errMessage}`);
  }
}

