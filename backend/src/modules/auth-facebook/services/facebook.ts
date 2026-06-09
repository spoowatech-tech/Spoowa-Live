import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/framework/utils"
import crypto from "crypto"

type FacebookAuthConfig = {
  clientId: string
  clientSecret: string
  callbackUrl: string
}

type InjectedDependencies = {
  logger: any
}

/**
 * Custom Facebook OAuth 2.0 auth provider for Medusa v2.
 * 
 * Follows the same pattern as @medusajs/auth-google but uses 
 * Facebook's OAuth endpoints and Graph API.
 */
export class FacebookAuthService extends AbstractAuthModuleProvider {
  static identifier = "facebook"
  static DISPLAY_NAME = "Facebook Authentication"

  protected config_: FacebookAuthConfig
  protected logger_: any

  static validateOptions(options: FacebookAuthConfig) {
    if (!options.clientId) {
      throw new Error("Facebook clientId (App ID) is required")
    }
    if (!options.clientSecret) {
      throw new Error("Facebook clientSecret (App Secret) is required")
    }
    if (!options.callbackUrl) {
      throw new Error("Facebook callbackUrl is required")
    }
  }

  constructor({ logger }: InjectedDependencies, options: FacebookAuthConfig) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
  }

  async register(_req: any, _authIdentityService: any): Promise<any> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Facebook does not support registration. Use method `authenticate` instead."
    )
  }

  async update(_req: any, _authIdentityService: any): Promise<any> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Facebook does not support update."
    )
  }

  /**
   * Initiates the Facebook OAuth flow by returning a redirect URL
   * to Facebook's OAuth consent screen.
   */
  async authenticate(req: any, authIdentityService: any) {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error_description}`,
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const state = {
      callback_url: body?.callback_url ?? this.config_.callbackUrl,
    }

    await authIdentityService.setState(stateKey, state)

    return this.getRedirect(this.config_.clientId, state.callback_url, stateKey)
  }

  /**
   * Handles the OAuth callback from Facebook.
   * Exchanges the authorization code for an access token, then
   * fetches the user profile from the Graph API.
   */
  async validateCallback(req: any, authIdentityService: any) {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error_description}`,
      }
    }

    const code = query?.code ?? body?.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const state = await authIdentityService.getState(query?.state)
    if (!state) {
      return { success: false, error: "No state provided, or session expired" }
    }

    try {
      // Step 1: Exchange authorization code for access token
      const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token")
      tokenUrl.searchParams.set("client_id", this.config_.clientId)
      tokenUrl.searchParams.set("client_secret", this.config_.clientSecret)
      tokenUrl.searchParams.set("code", code)
      tokenUrl.searchParams.set("redirect_uri", state.callback_url)

      const tokenResponse = await fetch(tokenUrl.toString()).then((r) => {
        if (!r.ok) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not exchange token, ${r.status}, ${r.statusText}`
          )
        }
        return r.json()
      })

      const accessToken = tokenResponse.access_token
      if (!accessToken) {
        return { success: false, error: "No access token received from Facebook" }
      }

      // Step 2: Fetch user profile from Graph API
      const profileUrl = new URL("https://graph.facebook.com/v19.0/me")
      profileUrl.searchParams.set("fields", "id,name,email,first_name,last_name,picture")
      profileUrl.searchParams.set("access_token", accessToken)

      const profile = await fetch(profileUrl.toString()).then((r) => {
        if (!r.ok) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not fetch profile, ${r.status}, ${r.statusText}`
          )
        }
        return r.json()
      })

      // Step 3: Verify identity and create/retrieve auth identity
      const { authIdentity, success } = await this.verify_(profile, authIdentityService)

      return {
        success,
        authIdentity,
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Verifies the Facebook user profile and creates or retrieves
   * the corresponding Medusa auth identity.
   */
  private async verify_(profile: any, authIdentityService: any) {
    if (!profile || !profile.id) {
      return { success: false, error: "No profile data found" }
    }

    const entity_id = profile.id
    const userMetadata = {
      name: profile.name,
      email: profile.email,
      picture: profile.picture?.data?.url,
      given_name: profile.first_name,
      family_name: profile.last_name,
    }

    let authIdentity
    try {
      authIdentity = await authIdentityService.retrieve({
        entity_id,
      })
    } catch (error: any) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await authIdentityService.create({
          entity_id,
          user_metadata: userMetadata,
        })
        authIdentity = createdAuthIdentity
      } else {
        return { success: false, error: error.message }
      }
    }

    return {
      success: true,
      authIdentity,
    }
  }

  /**
   * Builds the Facebook OAuth redirect URL.
   */
  private getRedirect(clientId: string, callbackUrl: string, stateKey: string) {
    const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "email,public_profile")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }
}
