'use client'

import React from 'react'
import AddUserForm from '@/components/AddUserForm'
import withAuth from '@/components/withAuth'

const ProtectedAddUserForm = withAuth(AddUserForm)

const Page = () => {
  return (
    <div>
      <ProtectedAddUserForm />
    </div>
  )
}

export default Page
