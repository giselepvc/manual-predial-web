'use client';

import { CSSProperties } from 'react';
import { Icon } from '@iconify/react';
import ReactSelect, {
  DropdownIndicatorProps,
  components,
  Props as ReactSelectProps,
} from 'react-select';
import { useTheme } from 'styled-components';
import { Container, ErrorMessage, LabelText } from './styles';

interface Props<OptionType, T extends boolean>
  extends ReactSelectProps<OptionType, T, { options: OptionType[] }> {
  label?: string;
  error?: string;
  width?: string;
  zIndex?: number;
  containerStyle?: CSSProperties;
  options: OptionType[];
  containerClassName?: string;
  isMulti?: T;
}

const { DropdownIndicator } = components;

const CustomDropdownIndicator = (
  props: DropdownIndicatorProps<any, any, any>,
) => {
  return (
    <DropdownIndicator {...props}>
      <Icon icon="ion:caret-down-outline" />
    </DropdownIndicator>
  );
};

const Select = <OptionType, T extends boolean = false>({
  containerStyle,
  label,
  placeholder,
  error,
  isMulti,
  width,
  zIndex,
  containerClassName,
  ...rest
}: Props<OptionType, T>) => {
  const theme = useTheme();

  return (
    <Container style={containerStyle} className={containerClassName}>
      {label && <LabelText>{label}</LabelText>}
      <ReactSelect
        placeholder={placeholder || 'Selecione'}
        isMulti={isMulti}
        noOptionsMessage={() => 'Nenhuma opção'}
        components={{
          DropdownIndicator: CustomDropdownIndicator,
        }}
        {...rest}
        styles={{
          control: prev => ({
            ...prev,
            border: 'none',
            background: theme.colors.gray3d,
            boxShadow: 'none',
            minHeight: '2.75rem',
            width: width || '230px',
            borderRadius: '0.625rem',
            padding: '0.1rem 0.2rem 0 1rem',
            zIndex: zIndex || 999,
            fontSize: '0.9rem',
            marginTop: '8px',
            fontWeight: 400,
            color: theme.colors.white,
          }),
          placeholder: prev => ({
            ...prev,
            padding: 0,
            color: theme.colors.gray9a,
          }),
          container: prev => ({
            ...prev,
            padding: 0,
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
          }),
          valueContainer: prev => ({
            ...prev,
            padding: 0,
          }),
          indicatorsContainer: prev => ({
            ...prev,
            color: theme.colors.gray9a,
          }),
          indicatorSeparator: prev => ({
            ...prev,
            display: 'none',
            margin: 0,
          }),
          dropdownIndicator: prev => ({
            ...prev,
            color: 'inherit',
            padding: '0',
            paddingRight: '0.5rem',
            fontSize: '1.25rem',
            ':hover': {
              color: 'inherit',
            },
          }),
          menu: prev => ({
            ...prev,
            top: 'auto',
            paddingTop: '0',
            boxShadow: 'none',
            border: 'none',
            borderRadius: '0.625rem',
            width: width || '230px',
            background: theme.colors.grayStronger,
          }),
          menuList: prev => ({
            ...prev,
            background: theme.colors.grayStronger,
            borderRadius: '0.625rem',
          }),
          singleValue: prev => ({
            ...prev,
            padding: 0,
            color: theme.colors.white,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
          }),
          option: prev => ({
            ...prev,
            background: theme.colors.grayStronger,
            color: theme.colors.white,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            padding: '0.5rem 1.25rem',
            ':hover': {
              filter: 'brightness(0.95)',
            },
            ':focus': {
              filter: 'brightness(0.95)',
            },
          }),
          noOptionsMessage: prev => ({
            ...prev,
            fontSize: '0.75rem',
            color: theme.colors.gray3d,
          }),
        }}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Select;
