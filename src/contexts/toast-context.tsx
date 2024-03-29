import { AnimatePresence, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { ComponentProps, createContext, PropsWithChildren, useCallback, useState } from 'react'

import { ToastContainer, ToastElement } from '@/components'

type ToastMessage = Pick<ComponentProps<typeof ToastElement>, 'message' | 'status'>

type Toast = ToastMessage & {
  id: string
}

type ToastContextType = {
  pushToast: (toastMessage: ToastMessage) => void
  removeToast: (id: string) => void
}

// Variants for animating the toast
const toastVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 }
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

// The ToastProvider is responsible for creating and removing toasts
export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast: ToastContextType['removeToast'] = useCallback(id => {
    setToasts(toasts => toasts.filter(t => t.id !== id))
  }, [])

  const pushToast: ToastContextType['pushToast'] = useCallback(
    toastMessage => {
      const id = nanoid()

      // Remove the toast if it already exists and add it to the end of the array
      setToasts(toasts => {
        const filteredToasts = toasts.filter(toast => toast.message !== toastMessage.message)
        return [...filteredToasts, { id, ...toastMessage }]
      })

      // Remove the toast after 5 seconds
      setTimeout(() => removeToast(id), 5000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ pushToast, removeToast }}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map(({ id, ...properties }) => (
            <motion.div key={id} variants={toastVariants} initial='initial' animate='animate' exit='initial'>
              <ToastElement onRemove={() => removeToast(id)} {...properties} />
            </motion.div>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  )
}
