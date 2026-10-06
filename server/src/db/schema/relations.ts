import { defineRelations } from "drizzle-orm";
import { contributionsTable } from "./contribution";
import { loanApplicationsTable } from "./loanApplication";
import { loansTable } from "./loans";
import { memberTable } from "./member";
import { rolesTable } from "./role";
import { usersTable } from "./user";
import { notificationsTable } from "./notification";
import { auditLogsTable } from "./auditLogs";
import { paymentsTable } from "./payments";
import { penaltiesTable } from "./penalties";
import {guarantorTable} from "./gurantors"
import { loansProductsTable } from "./loanProduct";
import {repaymentSchedulesTable } from "./repayment_schedules";
import { memberToRolesTable } from "./membersToRoles";

export const relations = defineRelations({ 
    memberTable,
    notificationsTable,
     contributionsTable,
      loanApplicationsTable,
       usersTable,
        loansTable,
         rolesTable,
        auditLogsTable,
        paymentsTable,
        penaltiesTable,
        guarantorTable,
        loansProductsTable,
        repaymentSchedulesTable,
        memberToRolesTable
        }, (r) => ({
    memberTable: {
        user:r.one.usersTable({
            from: r.memberTable.user_id,
            to: r.usersTable.id
        }),
        contributions: r.many.contributionsTable({
            from:r.memberTable.id,
            to:r.contributionsTable.member_id
        }),
        loanApplications: r.many.loanApplicationsTable({
            from:r.memberTable.id,
            to:r.loanApplicationsTable.member_id
        }),
        loans: r.many.loansTable({
            from:r.memberTable.id,
            to:r.loansTable.member_id
        }),
        notifications: r.many.notificationsTable({
            from:r.memberTable.id,
            to:r.notificationsTable.member_id
        }),
        guarantors: r.many.guarantorTable({
            from:r.memberTable.id,
            to:r.guarantorTable.member_id
        }),
        roles: r.many.rolesTable({ 
            from: r.memberTable.id.through(r.memberToRolesTable.member_id),
            to: r.rolesTable.id.through(r.memberToRolesTable.role_id)
        })
        
    },
    usersTable: {
        member: r.one.memberTable({
            from: r.usersTable.id,
            to: r.memberTable.user_id
        }),
        notifications: r.many.notificationsTable({
            from:r.usersTable.id,
            to:r.notificationsTable.user_id
        }),
        auditLogs: r.many.auditLogsTable({
            from:r.usersTable.id,
            to:r.auditLogsTable.user_id
        })
    },
    loansTable:{
        member: r.one.memberTable({
            from:r.loansTable.member_id,
            to:r.memberTable.id
        }),
        loanApplication: r.one.loanApplicationsTable({
            from:r.loansTable.loan_application_id,
            to:r.loanApplicationsTable.id
        }),
        payments: r.many.paymentsTable({
            from:r.loansTable.id,
            to:r.paymentsTable.loan_id
        }),
        repaymentSchedules: r.many.repaymentSchedulesTable({
            from:r.loansTable.id,
            to:r.repaymentSchedulesTable.loan_id
        }),
        penalties: r.many.penaltiesTable({
            from:r.loansTable.id,
            to:r.penaltiesTable.loan_id
        }),
        guarantors: r.many.guarantorTable({
            from:r.loansTable.id,
            to:r.guarantorTable.loan_id
        })
    },
    loanApplicationsTable:{
        member: r.one.memberTable({
            from:r.loanApplicationsTable.member_id,
            to:r.memberTable.id
        }),
        loanProduct: r.one.loansProductsTable({
            from:r.loanApplicationsTable.loan_product_id,
            to:r.loansProductsTable.id
        }),
        loan: r.one.loansTable({
            from:r.loanApplicationsTable.id,
            to:r.loansTable.loan_application_id
        }),  
    },
    contributionsTable:{
        member:r.one.memberTable({
            from: r.contributionsTable.member_id,
            to: r.memberTable.id
        })
    },
    notificationsTable:{
        user: r.one.usersTable({
            from : r.notificationsTable.user_id,
            to : r.usersTable.id
        }),
        member: r.one.memberTable({
            from : r.notificationsTable.member_id,
            to : r.memberTable.id
        })
    },
    auditLogsTable:{
        user: r.one.usersTable({
            from : r.auditLogsTable.user_id,
            to: r.usersTable.id
        })
    },
    guarantorTable:{
        loan: r.one.loansTable({
            from: r.guarantorTable.loan_id,
            to: r.loansTable.id
        }),
        member: r.one.memberTable({
            from: r.guarantorTable.member_id,
            to: r.memberTable.id
        })
    },
    penaltiesTable:{
        loan: r.one.loansTable({
            from: r.penaltiesTable.loan_id,
            to: r.loansTable.id
        }),
    },
    repaymentSchedulesTable:{
        loan: r.one.loansTable({
            from: r.repaymentSchedulesTable.loan_id,
            to: r.loansTable.id
        }),
    },
    paymentsTable:{
        loan: r.one.loansTable({
            from: r.paymentsTable.loan_id,
            to: r.loansTable.id
        }),
    },
    loansProductsTable:{
        loanApplications: r.many.loanApplicationsTable({
            from: r.loansProductsTable.id,
            to: r.loanApplicationsTable.loan_product_id
        }),
    },
    rolesTable:{
        members: r.many.memberTable({
            from: r.rolesTable.id.through(r.memberToRolesTable.role_id),
            to: r.memberTable.id.through(r.memberToRolesTable.member_id)
        })
    }
}));