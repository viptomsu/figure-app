import { Spin } from 'antd'

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <Spin size="large" />
      <p>Loading VieFigure Store...</p>
    </div>
  )
}
