'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Steps } from '@/components/ui/steps'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import ShippingInfo from '@/components/Checkout/ShippingInfo/ShippingInfo'
import Payment from '@/components/Checkout/Payment/Payment'
import { useCartStore, useUserStore } from '@/stores'
import { getAddressBooksByUserId } from '@/services/addressBookService'
import { useAuth } from '@/hooks/useAuth'

interface AddressBook {
  _id: string
  recipientName: string
  email: string
  phoneNumber: string
  address: string
  ward: string
  district: string
  city: string
}

const TOTAL_STEPS = 3

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth({ required: true })
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const user = useUserStore((state) => state.user)

  const [currentStep, setCurrentStep] = useState(0)
  const [addressList, setAddressList] = useState<AddressBook[]>([])
  const [selectedAddress, setSelectedAddress] = useState<AddressBook | null>(null)
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
            <div className="address-select-wrapper mb-5">
              <div className="row">
                <div className="col-12">
                  <div className="title text-center mt-5">
                    <h1 className="mt-5">Địa chỉ giao hàng</h1>
                  </div>
                </div>
              </div>
              {addressList.length > 0 ? (
                <RadioGroup value={selectedAddress?._id} onValueChange={handleAddressChange}>
                  <div className="space-y-4">
                    {addressList.map((address) => (
                      <div
                        key={address._id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={address._id} id={address._id} />
                          <Label htmlFor={address._id} className="flex-1 cursor-pointer">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold">{address.recipientName}</span>
                              <Separator orientation="vertical" className="h-4" />
                              <span>{address.email}</span>
                              <Separator orientation="vertical" className="h-4" />
                              <span>{address.phoneNumber}</span>
                              <Separator orientation="vertical" className="h-4" />
                              <span>
                                {address.address}, {address.ward}, {address.district}, {address.city}
                              </span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-center text-muted-foreground py-8">Không có địa chỉ nào.</p>
              )}
              <div className="mt-5">
                <Button disabled={!selectedAddress} onClick={handleNext}>
                  Tiếp tục
                </Button>
              </div>
            </div>
            <Button onClick={() => router.push('/profile')}>Thêm địa chỉ giao hàng</Button>
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
