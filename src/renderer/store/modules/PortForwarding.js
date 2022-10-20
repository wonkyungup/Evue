import Constants from './Constants'
import Security from '@/assets/js/security'

const Defs = Constants.state

const state = {
    arrTunneling: [],
    curDrawer: Defs.DRAWER_DIRECTION_PAGE || 0,
    session: {
      id: null,
      direction: Defs.STR_LOCAL,
      localHost: '',
      localPort: null,
      remoteHost: '',
      remotePort: null,
      serverHost: '',
      serverPort: null,
      serverUsername: '',
      serverPassword: ''
    }
}

const getters = {
    isWelcomePage: state => () => {
      if (state.arrTunneling.length > 0) {
        return false
      }

      return true
    },
    getDirectionTitle: state => () => {
      return state.session.direction.replace(/\b[a-z]/, value => value.toUpperCase())
    },
    isLocal: state => () => {
      return state.session.direction === Defs.STR_LOCAL
    },
    isRemote: state => () => {
      return state.session.direction === Defs.STR_REMOTE
    },
    isSocksv5: state => () => {
      return state.session.direction === Defs.STR_SOCKSV5
    },
    isDrawerDirection: state => () => {
      return state.curDrawer === Defs.DRAWER_DIRECTION_PAGE
    },
    isDrawerSource: state => () => {
      return state.curDrawer === Defs.DRAWER_SOURCE_PAGE
    },
    isDrawerServer: state => () => {
      return state.curDrawer === Defs.DRAWER_SERVER_PAGE
    },
    isDrawerDestination: state => () => {
      return state.curDrawer === Defs.DRAWER_DESTINATION_PAGE
    }
}

const mutations ={
    CLEAR_SESSION_VALUE (state) {
      state.curDrawer = Defs.DRAWER_DIRECTION_PAGE || 0
      state.session = {
          id: null,
          direction: Defs.STR_LOCAL,
          localHost: '',
          localPort: null,
          remoteHost: '',
          remotePort: null,
          serverHost: '',
          serverPort: null,
          serverUsername: '',
          serverPassword: ''
      }
    },
    SET_SESSION_VALUE (state, payload) {
      const session = state.session

      switch (state.curDrawer) {
        case Defs.DRAWER_DIRECTION_PAGE:
          session.direction = payload
          break
        case Defs.DRAWER_SOURCE_PAGE:
          if (session.direction === Defs.STR_LOCAL || session.direction === Defs.STR_SOCKSV5) {
            session.localHost = payload.hostname
            session.localPort = payload.port
          }

          if (session.direction === Defs.STR_REMOTE) {
            session.remoteHost = payload.hostname
            session.remotePort = payload.port
          }
          break
        case Defs.DRAWER_SERVER_PAGE:
          session.serverHost = payload.hostname
          session.serverPort = payload.port
          session.serverUsername = payload.username
          session.serverPassword = Security.encryption(payload.password)
          break
        case Defs.DRAWER_DESTINATION_PAGE:
          if (session.direction === Defs.STR_LOCAL || session.direction === Defs.STR_SOCKSV5) {
            session.remoteHost = payload.hostname
            session.remotePort = payload.port
          }

          if (session.direction === Defs.STR_REMOTE) {
            session.localHost = payload.hostname
            session.localPort = payload.port
          }
          break
        default:
          break
      }
    },
    MOVE_BACK_BUTTON (state) {
      if (state.curDrawer !== 0) {
        state.curDrawer--
      }
    },
    MOVE_NEXT_BUTTON (state) {
      state.curDrawer++
    },
    SET_DB_SESSION_ID (state, id) {
        const session = state.session
        const arrTunneling = state.arrTunneling

        if (id > 0) {
            session.id = id
            arrTunneling.push(session)
        }
    },
    SET_DB_ARR_TUNNELING (state, list) {
        const arrLowerCaseKey = list.map(value => Object.keys(value).reduce((acc, cur) => {
            acc[cur.toLowerCase()] = value[cur]
            return acc
        }, {}))

        if (arrLowerCaseKey.length > 0) {
            state.arrTunneling = arrLowerCaseKey
        }
    }
}

const actions = {
    clearSessionValue ({ commit }) {
      commit('CLEAR_SESSION_VALUE')
    },
    setSessionValue ({ commit }, payload) {
      commit('SET_SESSION_VALUE', payload)
    },
    moveBackButton ({ commit }) {
      commit('MOVE_BACK_BUTTON')
    },
    moveNextButton ({ commit }) {
      commit('MOVE_NEXT_BUTTON')
    },
    setDBSessionID ({ commit }, id) {
      commit('SET_DB_SESSION_ID', id)
    },
    setDBArrTunneling ({ commit }, list) {
      commit('SET_DB_ARR_TUNNELING', list)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
