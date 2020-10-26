import { SfdxCommand } from '@salesforce/command'
import { Aliases, Messages, OrgUsersConfig, SfdxError } from '@salesforce/core'
// import inquirer = require('inquirer')

Messages.importMessagesDirectory(__dirname)
const messages = Messages.loadMessages('sfdx-sorg-multiple-delete', 'org')

export default class Org extends SfdxCommand {
  protected static supportsDevhubUsername = true

  public async run() {
    // throw new SfdxError(messages.getMessage('error', [this.hubOrg.getOrgId()]))

    const con = this.hubOrg.getConnection()

    const awaits_result = await Promise.all([
      Aliases.create(Aliases.getDefaultOptions()),
      con
        .sobject<{ SignupUsername: string; ScratchOrgInfoId: string }>('ActiveScratchOrg')
        .select(['ScratchOrgInfoId', 'SignupUsername'])
        .execute(),
    ])

    const [als_instance, asos] = awaits_result
    if (asos.length === 0) {
      return
    }

    // const orgs = als_instance.getContents().orgs
    // const inversion_aliases = Object.keys(orgs).map(alias => ({ user_name: orgs[alias], alias }))

    // const created_scratch_org_user_names_by_local = asos.records.filter(
    //   aso => inversion_aliases.find(_ => _.user_name === aso.SignupUsername) != null,
    // )

    // console.log(created_scratch_org_user_names_by_local)

    // const sois = await con.query<{ ExpirationDate: string; LoginUrl: string; SignupUsername: string }>(
    //   `SELECT ExpirationDate, LoginUrl, SignupUsername FROM ScratchOrgInfo WHERE Id IN (${created_scratch_org_user_names_by_local
    //     .map(_ => `'${_.ScratchOrgInfoId}'`)
    //     .join(',')})`,
    // )
    // if (!sois.done) {
    //   throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.hubOrg.getOrgId()]))
    // }

    // const created_scratch_org_infos_by_local = sois.records.map(scratch_org_info => ({
    //   alias: inversion_aliases.find(_ => _.user_name === scratch_org_info.SignupUsername).alias,
    //   scratch_org_info,
    // }))

    // const title = 'Select the scratch org you want to delete (Press <space> to select)'
    // const prompt_result = await inquirer.prompt({
    //   type: 'checkbox',
    //   name: title,
    //   choices: created_scratch_org_infos_by_local.map(_ => {
    //     const url = _.scratch_org_info.LoginUrl.split('//')[1].split('.')[0]
    //     const name = `${_.alias} (expire on:${_.scratch_org_info.ExpirationDate}) [${url}]`
    //     return {
    //       name,
    //       value: { name, alias: _.alias },
    //     }
    //   }),
    // })

    // const select_aliases: { url: string; alias: string }[] = prompt_result[title]
    // console.log(select_aliases)
    // if (select_aliases.length === 0) {
    //   return
    // }

    ;(await OrgUsersConfig.create(OrgUsersConfig.getOptions(''))).unlink() // json delete
    als_instance.unsetAll(['']) // aliase delete
    await als_instance.write()
  }
}
