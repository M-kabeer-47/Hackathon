
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const inputVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

const buttonVariants = {
  hover: { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  tap: { scale: 0.98 },
}

export default function UserHome() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  })

  const onSubmit = (data) => {
    console.log(data)
    
  }

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
    reset()
  }

  const password = watch('password')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                key="name-fields"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: { opacity: 1, height: 'auto' },
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                    <motion.div variants={inputVariants}>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </motion.div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                    <motion.div variants={inputVariants}>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </motion.div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <motion.div variants={inputVariants}>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </motion.div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <motion.div variants={inputVariants} className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </motion.div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <motion.div variants={inputVariants} className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </motion.div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </motion.div>
        </form>
        <div className="mt-6">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
          </motion.div>
        </div>
        <div className="mt-8 text-center">
          <motion.button
            onClick={toggleForm}
            className="text-blue-500 hover:text-blue-600 font-medium focus:outline-none transition-colors duration-300 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <span className="ml-1 font-bold">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}