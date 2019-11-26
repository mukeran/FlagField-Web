import constants from './constants'

export const mapFlag = (mappings) => {
  let exp = {}
  Object.keys(mappings).forEach(key => {
    exp[key] = {
      get () {
        return mappings[key].state(this.$store.state)
      },
      set (value) {
        this.$store.commit(mappings[key].mutation, value)
      }
    }
  })
  return exp
}

export const mapIsRoute = (names) => {
  let computed = {}
  Object.keys(names).forEach((key) => {
    computed[key] = {
      get () {
        return this.$route.name === names[key]
      }
    }
  })
  return computed
}

export const mapInRoute = (names) => {
  let computed = {}
  Object.keys(names).forEach((key) => {
    computed[key] = {
      get () {
        return (names[key].indexOf(this.$route.name) > -1)
      }
    }
  })
  return computed
}

export const messageMap = new Map([
  [constants.status.NOT_LOGGED_IN, 'Not logged in!'],
  [constants.status.DUPLICATED_USERNAME, 'Duplicated user name!'],
  [constants.status.DUPLICATED_EMAIL, 'Duplicated email!'],
  [constants.status.VALIDATION_FAILED, 'Validation failed!'],
  [constants.status.WRONG_USERNAME_OR_PASSWORD, 'Wrong user name or password!'],
  [constants.status.DUPLICATED_ALIAS, 'Duplicated alias!'],
  [constants.status.NOT_ENOUGH_POINTS, 'Not enough points!'],
  [constants.status.MEMBER_PARTICIPATED, 'Some member have participated!'],
  [constants.status.TEAM_PARTICIPATED, 'This team has participated in this contest.'],
  [constants.status.NOT_MEMBER_OF_TEAM, 'Not a member of the team!'],
  [constants.status.NOT_ADMIN_OF_TEAM, 'you are not admin!'],
  [constants.status.TIMEOUT, 'time out'],
  [constants.status.ALREADY_JOINED_IN_TEAM, 'already joined in team'],
  [constants.status.INVALID_INVITATION_TOKEN, 'invalid invitation token'],
  [constants.status.NOT_INVITED, 'you are not invited'],
  [constants.status.ALREADY_INVITED, 'already invited'],
  [constants.status.NO_SUCH_APPLICATION, 'no such application!'],
  [constants.status.ALREADY_APPLIED, 'already applied'],
  [constants.status.CONTEST_PENDING, 'contest is pending'],
  [constants.status.CONTEST_STARTED, 'contest started'],
  [constants.status.CONTEST_ENDED, 'contest ended'],
  [constants.status.INVALID_CAPTCHA_FOR, 'invalid captcha'],
  [constants.status.SERVER_ERROR, 'server error'],
  [constants.status.SESSION_EXPIRED, 'session expired'],
  [constants.status.PERMISSION_DENIED, 'permission denied'],
  [constants.status.PARTLY_FAILED, 'partly failed'],
  [constants.status.INVALID_CAPTCHA, 'invalid captcha'],
  [constants.status.NOT_IN_WHITELIST, 'not in whitelist']
])
