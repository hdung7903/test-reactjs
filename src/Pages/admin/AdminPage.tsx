import React from 'react'
import { Outlet } from 'react-router-dom'
import adminProps from './adminProps'
import Layout from '../../Components/Layout'

export default function AdminPage() {
  return (
    <Layout defaultProps={adminProps} />
  )
}
