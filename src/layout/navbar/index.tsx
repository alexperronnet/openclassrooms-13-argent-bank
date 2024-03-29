import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Logo } from '@/components'
import { useToast } from '@/hooks'
import { resetAuth, resetProfile, useAppDispatch, useAppSelector } from '@/store'
import { tokenStorage } from '@/utils'

import { MenuItem } from './menu-item'
import styles from './styles.module.scss'

export const Navbar = () => {
  const navigate = useNavigate()

  // Store
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const { firstName } = useAppSelector(state => state.profile.infos) || {}

  const { pushToast } = useToast()

  const handleLogout = () => {
    tokenStorage.remove()
    dispatch(resetAuth())
    dispatch(resetProfile())
    navigate('/')
    pushToast({
      message: 'You have been successfully logged out',
      status: 'success'
    })
  }

  return (
    <nav className={styles.nav}>
      <Link to='/' className={styles['logo-wrapper']}>
        <Logo className={styles.logo} />
        <h1 className={styles.title}>Argent Bank</h1>
      </Link>
      <ul className={styles.menu}>
        {isAuthenticated ? (
          <Fragment>
            <MenuItem icon='accountCircle' label={firstName || 'Settings'} to='/settings' />
            <MenuItem icon='logoutBox' label='Sign Out' type='logout' onClick={handleLogout} />
          </Fragment>
        ) : (
          <MenuItem icon='loginBox' label='Sign In' to='/auth' />
        )}
      </ul>
    </nav>
  )
}
