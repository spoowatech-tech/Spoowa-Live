import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { FacebookAuthService } from "./services/facebook"

const services = [FacebookAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
