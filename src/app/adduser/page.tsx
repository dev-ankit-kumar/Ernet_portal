
'use client'

import React from 'react'
import AddUserForm from '@/components/AddUserForm'
import withAuth from '@/components/withAuth'

const page = () => {
  return (
    <div>
      <AddUserForm/>
    </div>
  )
}

export default withAuth(page)
