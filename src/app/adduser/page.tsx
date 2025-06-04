'use client'

import React from 'react'
import AddUserForm from '@/components/AddUserForm'
import withAuth from '@/components/withAuth'

const ProtectedAddUserForm = withAuth(AddUserForm)

const page = () => {
  return (
    <div>
      <ProtectedAddUserForm />
    </div>
  )
}

export default page
