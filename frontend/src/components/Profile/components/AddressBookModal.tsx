import React, { useState, useEffect } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { emailSchema, phoneSchema, requiredStringSchema } from '@/schema/validation';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchProvinces, fetchDistrictsByProvince, fetchWardsByDistrict } from '@/services/client';

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

const validationSchema = z.object({
  recipientName: requiredStringSchema('Vui lòng nhập tên người nhận!'),
  phoneNumber: phoneSchema,
  email: emailSchema,
  address: requiredStringSchema('Vui lòng nhập địa chỉ!'),
  city: requiredStringSchema('Vui lòng chọn tỉnh/thành phố!'),
  district: requiredStringSchema('Vui lòng chọn quận/huyện!'),
  ward: requiredStringSchema('Vui lòng chọn phường/xã!'),
});

const AddressBookModal = NiceModal.create<{
  isEditMode: boolean;
  onSave: (values: any) => Promise<void>;
  initialValues?: any;
}>(({ isEditMode, onSave, initialValues }) => {
  const modal = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      recipientName: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      district: '',
      ward: '',
    },
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  useEffect(() => {
    fetchProvincesFromAPI();
    if (isEditMode && initialValues) {
      form.reset(initialValues);
      const initializeCascadingFields = async () => {
        const province = provinces.find((p) => p.name === initialValues.city);
        if (province) {
          setSelectedProvince({ name: province.name, code: province.code });
          const districtsData = await fetchDistrictsByProvince(province.code);
          setDistricts(districtsData);
          const district = districtsData.find((d: District) => d.name === initialValues.district);
          if (district) {
            setSelectedDistrict({ name: district.name, code: district.code });
            const wardsData = await fetchWardsByDistrict(district.code);
            setWards(wardsData);
          }
        }
      };
      initializeCascadingFields();
    } else {
      form.reset({
        recipientName: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: '',
      });
      setDistricts([]);
      setWards([]);
      setSelectedProvince(null);
      setSelectedDistrict(null);
    }
  }, [isEditMode, initialValues, form, provinces]);

  const fetchProvincesFromAPI = async () => {
    const data = await fetchProvinces();
    setProvinces(data);
  };

  const fetchDistrictsFromAPI = async (provinceCode: string): Promise<District[]> => {
    if (!provinceCode) {
      return [];
    }
    const data = await fetchDistrictsByProvince(provinceCode);
    setDistricts(data);
    return data;
  };

  const fetchWardsFromAPI = async (districtCode: string): Promise<Ward[]> => {
    if (!districtCode) {
      return [];
    }
    const data = await fetchWardsByDistrict(districtCode);
    setWards(data);
    return data;
  };

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.code === value);
    if (province) {
      setSelectedProvince({ name: province.name, code: value });
      setDistricts([]);
      setWards([]);
      fetchDistrictsFromAPI(value);
    }
  };

  const handleDistrictChange = (value: string) => {
    const district = districts.find((d) => d.code === value);
    if (district) {
      setSelectedDistrict({ name: district.name, code: value });
      setWards([]);
      fetchWardsFromAPI(value);
    }
  };

  const onSubmit = async (values: any) => {
    const addressData = {
      ...values,
      city: selectedProvince?.name || values.city,
      district: selectedDistrict?.name || values.district,
    };
    setIsSubmitting(true);
    try {
      await onSave(addressData);
      modal.hide();
      setTimeout(() => modal.remove(), 300);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          modal.hide();
          setTimeout(() => modal.remove(), 300);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="address-book-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên người nhận" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select
                    value={
                      field.value ? provinces.find((p) => p.name === field.value)?.code || '' : ''
                    }
                    onValueChange={(value) => {
                      const province = provinces.find((p) => p.code === value);
                      if (province) {
                        field.onChange(province.name);
                        form.resetField('district');
                        form.resetField('ward');
                        handleProvinceChange(value);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    value={
                      field.value ? districts.find((d) => d.name === field.value)?.code || '' : ''
                    }
                    onValueChange={(value) => {
                      const district = districts.find((d) => d.code === value);
                      if (district) {
                        field.onChange(district.name);
                        form.resetField('ward');
                        handleDistrictChange(value);
                      }
                    }}
                    disabled={districts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <Select
                    value={field.value ? wards.find((w) => w.name === field.value)?.code || '' : ''}
                    onValueChange={(value) => {
                      const wardName = wards.find((w) => w.code === value)?.name || '';
                      field.onChange(wardName);
                    }}
                    disabled={wards.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => modal.hide()} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" form="address-book-form" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default AddressBookModal;
