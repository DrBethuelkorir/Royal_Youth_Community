import {Router} from 'express'

import { asignRoleToUser, createRole, deleteRole, findRoleWithId, getAllRoles, updateRole } from '../controllers/controllers.roles';

export const rolerouter = Router()


rolerouter.post("/createRole", createRole)
rolerouter.delete("/deleteRole",deleteRole)
rolerouter.put("/updateRole",updateRole)
rolerouter.post("/assignRoleToUser",asignRoleToUser)
rolerouter.get("/findRoleWithId",findRoleWithId)
rolerouter.get("/getAllRolesRoles",getAllRoles)

