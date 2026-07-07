'use client';

import {
  createDateTimePicker,
  DateTimePickerProvider,
  useDateTimePicker,
} from '@gluestack-ui/core/date-time-picker/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
  useStyleContext,
  withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { styled } from 'nativewind';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Calendar,
  CalendarHeader,
  CalendarHeaderPrevButton,
  CalendarHeaderTitle,
  CalendarHeaderNextButton,
  CalendarBody,
  CalendarWeekDaysHeader,
  CalendarWeekDay,
  CalendarGrid,
  CalendarWeek,
  CalendarDay,
  CalendarDayText,
} from '../calendar';
import { ChevronLeftIcon, ChevronRightIcon } from '../icon';
import {
  dateTimePickerIconStyle,
  dateTimePickerInputStyle,
  dateTimePickerStyle,
  dateTimePickerTriggerStyle,
} from './styles';

const SCOPE = 'DATE_TIME_PICKER';

export type DateTimePickerMode = 'date' | 'time' | 'datetime';

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  display?: 'modal' | 'inline';
  children?: React.ReactNode;
}

const DateTimePickerTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(function DateTimePickerTriggerWrapper({ ...props }, ref) {
  return <Pressable {...props} ref={ref} />;
});

const StyledTextInput = styled(TextInput, {
  className: 'style',
});

const StyledUIIcon = styled(UIIcon, {
  className: 'style',
});

const UIDateTimePicker = createDateTimePicker({
  Root: withStyleContext(View, SCOPE),
  Trigger: withStyleContext(DateTimePickerTriggerWrapper, SCOPE),
  Input: StyledTextInput,
  Icon: StyledUIIcon,
});

type IDateTimePickerProps = VariantProps<typeof dateTimePickerStyle> &
  DateTimePickerProps & { className?: string };

const DateTimePicker = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker>,
  IDateTimePickerProps
>(function DateTimePicker(
  {
    className,
    value,
    onChange,
    mode = 'date',
    minimumDate,
    maximumDate,
    locale,
    timeZoneOffsetInMinutes,
    is24Hour,
    disabled,
    placeholder,
    format = 'YYYY-MM-DD',
    display = 'modal',
    children,
    ...props
  },
  ref
) {
  return (
    <DateTimePickerProvider
      value={value}
      onChange={onChange}
      mode={mode}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      locale={locale}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      is24Hour={is24Hour}
      disabled={disabled}
      placeholder={placeholder}
      format={format}
    >
      <UIDateTimePicker
        className={dateTimePickerStyle({ class: className })}
        ref={ref}
        {...props}
      >
        {children}
      </UIDateTimePicker>
      <CalendarPickerModal
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={onChange}
      />
    </DateTimePickerProvider>
  );
});

function CalendarPickerModal({
  minimumDate,
  maximumDate,
  onChange,
}: {
  minimumDate?: Date;
  maximumDate?: Date;
  onChange?: (date: Date | undefined) => void;
}) {
  const { isOpen, setIsOpen, value } = useDateTimePicker();
  const [tempValue, setTempValue] = useState<Date>(value || new Date());

  useEffect(() => {
    if (isOpen) {
      setTempValue(value || new Date());
    }
  }, [isOpen, value]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsOpen(false)}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setIsOpen(false)}
        />
        <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 8 }}>
            <Pressable onPress={() => setIsOpen(false)}>
              <Text style={{ color: '#6366f1', fontWeight: '600', fontSize: 16 }}>Cancel</Text>
            </Pressable>
            <Text style={{ fontWeight: '600', fontSize: 16, color: '#f8fafc' }}>Select Date</Text>
            <Pressable
              onPress={() => {
                setIsOpen(false);
                onChange?.(tempValue);
              }}
            >
              <Text style={{ color: '#6366f1', fontWeight: '600', fontSize: 16 }}>Done</Text>
            </Pressable>
          </View>
          
          <View style={{ backgroundColor: '#18181b', borderRadius: 8 }}>
            {/* @ts-ignore */}
            <Calendar
              mode="single"
              value={tempValue}
              onValueChange={(date) => {
                if (date instanceof Date) {
                  setTempValue(date);
                }
              }}
            >
              <CalendarHeader>
                <CalendarHeaderPrevButton>
                  <ChevronLeftIcon color="#fff" size={20} />
                </CalendarHeaderPrevButton>
                <CalendarHeaderTitle />
                <CalendarHeaderNextButton>
                  <ChevronRightIcon color="#fff" size={20} />
                </CalendarHeaderNextButton>
              </CalendarHeader>
              <CalendarBody>
                <CalendarWeekDaysHeader>
                  <CalendarWeekDay />
                </CalendarWeekDaysHeader>
                <CalendarGrid>
                  <CalendarWeek>
                    <CalendarDay>
                      <CalendarDayText />
                    </CalendarDay>
                  </CalendarWeek>
                </CalendarGrid>
              </CalendarBody>
            </Calendar>
          </View>

        </View>
      </View>
    </Modal>
  );
}

type IDateTimePickerTriggerProps = VariantProps<
  typeof dateTimePickerTriggerStyle
> &
  React.ComponentProps<typeof UIDateTimePicker.Trigger> & {
    className?: string;
  };

const DateTimePickerTrigger = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Trigger>,
  IDateTimePickerTriggerProps
>(function DateTimePickerTrigger(
  { className, size = 'md', variant = 'outline', ...props },
  ref
) {
  const { disabled, setIsOpen } = useDateTimePicker();

  return (
    <UIDateTimePicker.Trigger
      className={dateTimePickerTriggerStyle({
        class: className,
        size,
        variant,
      })}
      ref={ref}
      context={{ size, variant }}
      disabled={disabled}
      onPress={() => !disabled && setIsOpen(true)}
      {...props}
    />
  );
});

type IDateTimePickerInputProps = VariantProps<typeof dateTimePickerInputStyle> &
  React.ComponentProps<typeof UIDateTimePicker.Input> & { className?: string };

const DateTimePickerInput = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Input>,
  IDateTimePickerInputProps
>(function DateTimePickerInput({ className, ...props }, ref) {
  const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
  const { value, placeholder, format } = useDateTimePicker();

  const displayValue = useMemo(() => {
    if (!value) return '';
    if (format) return formatDate(value, format);
    return value.toLocaleDateString();
  }, [value, format]);

  return (
    <UIDateTimePicker.Input
      className={dateTimePickerInputStyle({
        class: className,
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
        },
      })}
      ref={ref}
      value={displayValue}
      placeholder={placeholder}
      editable={false}
      pointerEvents="none"
      {...props}
    />
  );
});

type IDateTimePickerIconProps = VariantProps<typeof dateTimePickerIconStyle> &
  React.ComponentProps<typeof UIDateTimePicker.Icon> & { className?: string };

const DateTimePickerIcon = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Icon>,
  IDateTimePickerIconProps
>(function DateTimePickerIcon({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIDateTimePicker.Icon
        ref={ref}
        {...props}
        className={dateTimePickerIconStyle({ class: className })}
        size={size}
      />
    );
  }

  return (
    <UIDateTimePicker.Icon
      className={dateTimePickerIconStyle({
        class: className,
        size,
        parentVariants: {
          size: parentSize,
        },
      })}
      ref={ref}
      {...props}
    />
  );
});

function formatDate(date: Date, format: string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}

export {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
};
