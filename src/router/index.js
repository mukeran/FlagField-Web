import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/manage',
      component: () => import('../components/Manage/Frame'),
      children: [
        {
          path: '',
          name: 'manageIndex',
          component: () => import('../components/Manage/Index')
        },
        {
          path: 'contest',
          name: 'manageContestList',
          component: () => import('../components/Manage/Contest/List')
        },
        {
          path: 'contest/:contestID/problem/:problemAlias',
          name: 'manageContestViewProblemView',
          component: () => import('../components/Manage/Contest/View/Problem/View/Frame'),
          children: [
            {
              path: 'flag',
              name: 'manageContestViewProblemViewFlag',
              component: () => import('../components/Manage/Contest/View/Problem/View/Flag/List')
            },
            {
              path: 'hint',
              name: 'manageContestViewProblemViewHint',
              component: () => import('../components/Manage/Contest/View/Problem/View/Hint/List')
            },
            {
              path: 'resource',
              name: 'manageContestViewProblemViewResource',
              component: () => import('../components/Manage/Contest/View/Problem/View/Resource/List')
            },
            {
              path: 'settings',
              name: 'manageContestViewProblemViewSettings',
              component: () => import('../components/Manage/Contest/View/Problem/View/Settings')
            }
          ]
        },
        {
          path: 'contest/:contestID',
          name: 'manageContestView',
          component: () => import('../components/Manage/Contest/View/Frame'),
          children: [
            {
              path: 'problem',
              name: 'manageContestViewProblemList',
              component: () => import('../components/Manage/Contest/View/Problem/List')
            },
            {
              path: 'team',
              name: 'manageContestViewTeam',
              component: () => import('../components/Manage/Contest/View/Team/List')
            },
            {
              path: 'resource',
              name: 'manageContestViewResource',
              component: () => import('../components/Manage/Contest/View/Resource/List')
            },
            {
              path: 'notification',
              name: 'manageContestViewNotification',
              component: () => import('../components/Manage/Contest/View/Notification/List')
            },
            {
              path: 'settings',
              name: 'manageContestViewSettings',
              component: () => import('../components/Manage/Contest/View/Settings')
            }
          ]
        },
        {
          path: 'submission',
          name: 'manageSubmission',
          component: () => import('../components/Manage/Submission')
        },
        {
          path: 'user',
          name: 'manageUserList',
          component: () => import('../components/Manage/User/List')
        },
        {
          path: 'user/:userID',
          name: 'manageUserView',
          component: () => import('../components/Manage/User/View/Frame'),
          children: [
            {
              path: 'team',
              name: 'manageUserViewTeam',
              component: () => import('../components/Manage/User/View/Team')
            }
          ]
        },
        {
          path: 'team',
          name: 'manageTeam',
          component: () => import('../components/Manage/Team/List')
        },
        {
          path: 'team/:teamID',
          name: 'manageTeamView',
          component: () => import('../components/Manage/Team/View/Frame'),
          props: { admin: true },
          children: [
            {
              path: 'member',
              name: 'manageTeamMember',
              component: () => import('../components/Manage/Team/View/Member/Member')
            },
            {
              path: 'admin',
              name: 'manageTeamAdmin',
              component: () => import('../components/Manage/Team/View/Admin/Admin')
            },
            {
              path: 'invitation',
              name: 'manageTeamInvitation',
              component: () => import('../components/Manage/Team/View/Invitation/Invitation')
            },
            {
              path: 'application',
              name: 'manageTeamApplication',
              component: () => import('../components/Manage/Team/View/Application/Application')
            }
          ]
        },
        {
          path: 'resource',
          name: 'manageResource',
          component: () => import('../components/Manage/Resource/List')
        },
        {
          path: 'notification',
          name: 'manageNotification',
          component: () => import('../components/Manage/Notification/List')
        },
        {
          path: 'config',
          name: 'manageConfig',
          component: () => import('../components/Manage/Config/Frame'),
          children: [
            {
              path: 'system',
              name: 'manageConfigSystem',
              component: () => import('../components/Manage/Config/System')
            },
            {
              path: 'user',
              name: 'manageConfigUser',
              component: () => import('../components/Manage/Config/User')
            }
          ]
        }
      ]
    },
    {
      path: '/',
      component: () => import('../components/Frontend/Frame'),
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('../components/Frontend/Index')
        },
        {
          path: 'practice',
          name: 'practiceList',
          component: () => import('../components/Frontend/Practice/List')
        },
        {
          path: 'practice/:problemAlias',
          name: 'practiceView',
          component: () => import('../components/Frontend/Practice/View')
        },
        {
          path: 'rank',
          name: 'rank',
          component: () => import('../components/Frontend/Rank')
        },
        {
          path: 'contest',
          name: 'contestList',
          component: () => import('../components/Frontend/Contest/List')
        },
        {
          path: 'contest/:contestID',
          name: 'contestView',
          component: () => import('../components/Frontend/Contest/View/Frame'),
          children: [
            {
              path: 'problem',
              name: 'contestViewProblemList',
              component: () => import('../components/Frontend/Contest/View/Problem/List')
            },
            {
              path: 'problem/:problemAlias',
              name: 'contestViewProblemView',
              component: () => import('../components/Frontend/Contest/View/Problem/View')
            },
            {
              path: 'rank',
              name: 'contestViewRank',
              component: () => import('../components/Frontend/Contest/View/Rank')
            },
            {
              path: 'team',
              name: 'contestViewTeam',
              component: () => import('../components/Frontend/Contest/View/Team')
            },
            {
              path: 'notification',
              name: 'contestViewNotification',
              component: () => import('../components/Frontend/Contest/View/Notification')
            }
          ]
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/Frontend/Login')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../components/Frontend/Register')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../components/Frontend/About')
        },
        {
          path: 'user/:userID',
          name: 'userProfile',
          component: () => import('../components/Frontend/UserProfile')
        },
        {
          path: 'notification',
          name: 'notification',
          component: () => import('../components/Frontend/Notification')
        },
        {
          path: 'team',
          name: 'team',
          component: () => import('../components/Frontend/Team/Frame'),
          children: [
            {
              path: 'my',
              name: 'myTeam',
              component: () => import('../components/Frontend/Team/My')
            },
            {
              path: 'list',
              name: 'teamList',
              component: () => import('../components/Frontend/Team/List')
            },
            {
              path: 'invitation',
              name: 'myInvitation',
              component: () => import('../components/Frontend/Team/Invitation')
            },
            {
              path: 'application',
              name: 'myApplication',
              component: () => import('../components/Frontend/Team/Application')
            }
          ]
        },
        {
          path: 'team/:teamID',
          name: 'teamView',
          component: () => import('../components/Frontend/Team/View')
        },
        {
          path: 'team/:teamID/manage',
          name: 'teamManage',
          component: () => import('../components/Manage/Team/View/Frame'),
          props: { admin: false },
          children: [
            {
              path: 'member',
              name: 'teamMember',
              component: () => import('../components/Manage/Team/View/Member/Member')
            },
            {
              path: 'admin',
              name: 'teamAdmin',
              component: () => import('../components/Manage/Team/View/Admin/Admin')
            },
            {
              path: 'invitation',
              name: 'teamInvitation',
              component: () => import('../components/Manage/Team/View/Invitation/Invitation')
            },
            {
              path: 'application',
              name: 'teamApplication',
              component: () => import('../components/Manage/Team/View/Application/Application')
            }
          ]
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../components/Frontend/Settings/Frame'),
          children: [
            {
              path: 'profile',
              name: 'settingsProfile',
              component: () => import('../components/Frontend/Settings/Profile')
            },
            {
              path: 'security',
              name: 'settingsSecurity',
              component: () => import('../components/Frontend/Settings/Security')
            },
            {
              path: 'preference',
              name: 'settingsPreference',
              component: () => import('../components/Frontend/Settings/Preference')
            },
            {
              path: 'dangerZone',
              name: 'settingsDangerZone',
              component: () => import('../components/Frontend/Settings/DangerZone')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  router.app.$options.store.dispatch('session/resume')
  next()
})

export default router
