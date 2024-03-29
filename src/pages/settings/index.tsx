import { RegisterOptions, useForm } from 'react-hook-form'

import { Button, Field } from '@/components'
import { useSeo, useToast } from '@/hooks'
import { updateProfile, useAppDispatch, useAppSelector } from '@/store'
import { formatString, regexValidation } from '@/utils'

import { SettingsInfos } from './settings-infos'
import { SettingsSection } from './settings-section'
import styles from './styles.module.scss'

type FormValues = {
  newFirstName: string
  newLastName: string
}

const defaultValues = {
  newFirstName: '',
  newLastName: ''
}

export const Settings = () => {
  useSeo({ page: 'Settings' })

  const { pushToast } = useToast()

  // Store
  const dispatch = useAppDispatch()
  const { firstName = '', lastName = '', email = '' } = useAppSelector(state => state.profile.infos) || {}

  const { register, handleSubmit, formState, reset } = useForm<FormValues>({ mode: 'onTouched', defaultValues })
  const { errors, isSubmitting } = formState

  const onSubmit = (data: FormValues) => {
    const { newFirstName, newLastName } = data

    // We need to format the new values for consistency with the API
    const formattedNewFirstName = formatString.name(newFirstName)
    const formattedNewLastName = formatString.name(newLastName)

    // Check if the new values are different from the old ones
    const isFirstNameUnchanged = !formattedNewFirstName || formattedNewFirstName === firstName
    const isLastNameUnchanged = !formattedNewLastName || formattedNewLastName === lastName

    if (isFirstNameUnchanged && isLastNameUnchanged) {
      return pushToast({ status: 'error', message: 'No changes were made!' })
    }

    // We update the new values only if they are different from the old ones (empty = unchanged)
    const updatedFirstName = isFirstNameUnchanged ? firstName : formattedNewFirstName
    const updatedLastName = isLastNameUnchanged ? lastName : formattedNewLastName

    dispatch(updateProfile({ firstName: updatedFirstName, lastName: updatedLastName }))
    pushToast({ status: 'success', message: 'Your profile has been updated!' })
    reset(defaultValues)
  }

  const validationRules = {
    firstName: {
      pattern: { value: regexValidation.name, message: 'Entered value does not match name format' }
    },
    lastName: {
      pattern: { value: regexValidation.name, message: 'Entered value does not match name format' }
    }
  }

  const renderField = (type: string, label: string, name: keyof FormValues, validation: RegisterOptions) => (
    <Field
      type={type as 'text'}
      label={label}
      {...register(name, validation)}
      disabled={isSubmitting}
      error={errors[name]?.message}
    />
  )

  return (
    <main className={styles.settings}>
      <div className={styles.content}>
        <SettingsSection title='Personal Information'>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            {renderField('text', 'First Name', 'newFirstName', validationRules.firstName)}
            {renderField('text', 'Last Name', 'newLastName', validationRules.lastName)}
            <Field label='Email' type='email' value={email} disabled />
            <Button variant='secondary' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </SettingsSection>
        <SettingsSection title='Security' notAvailable>
          <form className={styles.form}>
            <Field label='Password' type='text' disabled />
            <Field label='Confirm Password' type='text' disabled />
            <Button variant='secondary' disabled>
              Update Password
            </Button>
          </form>
        </SettingsSection>
        <SettingsSection title='Danger Zone' notAvailable>
          <Button variant='danger' disabled>
            Delete Account
          </Button>
        </SettingsSection>
      </div>
      <SettingsInfos />
    </main>
  )
}
