'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Col, Divider, List, Radio, Row, Steps, Typography } from 'antd'
import ShippingInfo from '@/components/Checkout/ShippingInfo/ShippingInfo'
import Payment from '@/components/Checkout/Payment/Payment'
import { useCartStore, useUserStore } from '@/stores'
import { getAddressBooksByUserId } from '@/services/addressBookService'
import { useAuth } from '@/hooks/useAuth'

const { Text } = Typography
const TOTAL_STEPS = 3

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth({ required: true })
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const user = useUserStore((state) => state.user)

  const [currentStep, setCurrentStep] = useState(0)
  const [addressList, setAddressList] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [, setOrderCode] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      return
    }

    const fetchAddresses = async () => {
      try {
        const addressData = await getAddressBooksByUserId(user.userId)
        if (addressData && addressData.length > 0) {
          setAddressList(addressData)
          setSelectedAddress(addressData[0])
          localStorage.setItem('selectedAddressBookId', addressData[0]._id)
        }
      } catch (error) {
        console.error('Error fetching address:', error)
      }
    }

    fetchAddresses()
  }, [isAuthenticated, user])

  const handleAddressChange = useCallback(
    (value: string) => {
      const address = addressList.find((item) => item._id === value)
      if (address) {
        setSelectedAddress(address)
        localStorage.setItem('selectedAddressBookId', address._id)
      }
    },
    [addressList]
  )

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handlePaymentComplete = useCallback(() => {
    setCurrentStep(TOTAL_STEPS - 1)
  }, [])

  const steps = useMemo(
    () => [
      {
        title: 'Địa chỉ giao hàng',
        content: (
          <>
            <div className="address-select-wrapper" style={{ marginBottom: '20px' }}>
              <div className="row">
                <div className="col-12">
                  <div className="title text-center" style={{ marginTop: '20px' }}>
                    <h1 style={{ marginTop: '20px' }}>Địa chỉ giao hàng</h1>
                  </div>
                </div>
              </div>
              {addressList.length > 0 ? (
                <List
                  bordered
                  dataSource={addressList}
                  renderItem={(address) => (
                    <List.Item
                      style={{
                        padding: '16px 24px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      <Row style={{ width: '100%' }} align="middle">
                        <Col span={20}>
                          <Radio
                            value={address._id}
                            checked={selectedAddress?._id === address._id}
                            onChange={() => handleAddressChange(address._id)}
                          >
                            <Text strong>{address.recipientName}</Text>
                          </Radio>
                          <Divider type="vertical" />
                          <Text>{address.email}</Text>
                          <Divider type="vertical" />
                          <Text>{address.phoneNumber}</Text>
                          <Divider type="vertical" />
                          <Text>
                            {address.address}, {address.ward}, {address.district}, {address.city}
                          </Text>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              ) : (
                <p>Không có địa chỉ nào.</p>
              )}
              <div style={{ marginTop: '20px' }}>
                <input
                  type="button"
                  disabled={!selectedAddress}
                  style={{
                    backgroundColor: '#0060c9',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: selectedAddress ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                  }}
                  value="Tiếp tục"
                  onClick={handleNext}
                />
              </div>
            </div>
            <Button
              type="primary"
              style={{ backgroundColor: '#0060c9', borderColor: '#0060c9' }}
              onClick={() => router.push('/profile')}
            >
              Thêm địa chỉ giao hàng
            </Button>
          </>
        ),
      },
      {
        title: 'Thông tin vận chuyển',
        content: (
          <ShippingInfo
            handleShippingSubmit={handleNext}
            handlePrev={handlePrev}
            selectedAddress={selectedAddress}
          />
        ),
      },
      {
        title: 'Thanh toán',
        content: (
          selectedAddress ? (
            <Payment
              back={handlePrev}
              cart={cart}
              selectedAddress={selectedAddress}
              handlePaymentSubmit={handlePaymentComplete}
              setOrderCode={setOrderCode}
            />
          ) : (
            <p>Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.</p>
          )
        ),
      },
    ],
    [addressList, cart, handleAddressChange, handleNext, handlePaymentComplete, handlePrev, router, selectedAddress]
  )

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="checkout-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Thanh toán</span>
              </li>
            </ul>
          </div>
        </section>
        <section id="checkout">
          <div className="container">
            <Steps current={currentStep} items={steps.map((item) => ({ title: item.title }))} />
            <div className="steps-content">{steps[currentStep]?.content}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
