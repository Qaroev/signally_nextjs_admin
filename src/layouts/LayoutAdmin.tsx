import { AppShell, Box, Burger, Header, Navbar, Text } from '@mantine/core';
import Link from 'next/link';
import { useEffect } from 'react';
import { AuthMenu } from '../components/others/AuthMenu';
import AuthGuard from '../guards/AuthGuard';
import { setOpenDrawer } from '../models_store/appSlice';
import { sagaTypes } from '../models_store/_saga';
import { useAppDispatch, useAppSelector } from '../models_store/_store';
import DrawerAdmin from './_navigation/DrawerAdmin';
import { NavSidebar } from './_navigation/NavSideBar';
import { adminNavbarLinks } from './_navigation/_links';

type Props = {
  children: React.ReactNode;
};

export default function LayoutAdmin({ children }: Props) {
  const dispatch = useAppDispatch();
  const { openDrawer } = useAppSelector((state) => state.app);
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.firebaseAuth);

  useEffect(() => {
    if (isAuthenticated) startStreams();
    if (!isAuthenticated) cancleStreams();
  }, [isAuthenticated]);

  async function startStreams() {
    dispatch({ type: sagaTypes.STREAM_SIGNALS });
    dispatch({ type: sagaTypes.STREAM_USERS });
    dispatch({ type: sagaTypes.STREAM_ANNOUNCEMENTS });
  }

  async function cancleStreams() {
    dispatch({ type: sagaTypes.STREAM_SIGNALS_CANCEL });
    dispatch({ type: sagaTypes.STREAM_USERS_CANCEL });
    dispatch({ type: sagaTypes.STREAM_ANNOUNCEMENTS_CANCEL });
  }

  return (
    <AuthGuard>
      <DrawerAdmin />
      <AppShell
        className='dark:bg-black dark:text-white'
        padding='md'
        fixed
        header={
          <Header height={70} className='dark:bg-black h-full flex pr-4'>
            <div className='xs:flex md:hidden justify-center items-center ml-4'>
              <Burger
                opened={openDrawer}
                onClick={() => {
                  dispatch(setOpenDrawer());
                }}
                size='sm'
              />
            </div>

            <Link href={'/signals'}>
              <Box className='cursor-pointer ml-4 flex align-middle items-center'>
                <img src='/images/logo.png' className='w-[30px]' />
                <Text className='ml-2 font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0'>
                  Signally
                </Text>
              </Box>
            </Link>

            <Box sx={{ flexGrow: 1 }} />

            <AuthMenu />
          </Header>
        }
        navbar={
          <div className='xs:hidden md:flex'>
            <Navbar p='xs' width={{ md: 260 }} className='dark:bg-black dark:text-white'>
              <NavSidebar navConfig={adminNavbarLinks} />
            </Navbar>
          </div>
        }>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
