import { ReactNode } from 'react';
import LayoutAdmin from './LayoutAdmin';
import LogoOnlyLayout from './LogoOnlyLayout';

type Props = {
  children: ReactNode;
  variant?: 'main' | 'logoOnly' | 'admin';
};

export default function Layout({ children, variant = 'admin' }: Props) {
  if (variant === 'admin') {
    return <LayoutAdmin>{children}</LayoutAdmin>;
  }

  return <LogoOnlyLayout>{children}</LogoOnlyLayout>;
}
