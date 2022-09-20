import { Box, Drawer, Text } from '@mantine/core';
import Link from 'next/link';
import Iconify from '../../components/others/Iconify';
import { setCloseDrawer } from '../../models_store/appSlice';
import { useAppDispatch, useAppSelector } from '../../models_store/_store';
import { NavSidebar } from './NavSideBar';
import { adminNavbarLinks } from './_links';

export default function DrawerAdmin() {
  const dispatch = useAppDispatch();
  const { openDrawer } = useAppSelector((state) => state.app);

  return (
    <Drawer
      className='dark:bg-gray-400 py-4 px-4'
      title=''
      position='left'
      size={400}
      withCloseButton={false}
      opened={openDrawer}
      onClose={() => dispatch(setCloseDrawer())}>
      <Box onClick={() => dispatch(setCloseDrawer())} className='flex justify-end m-0 cursor-pointer'>
        <Iconify className='dark:bg-gray-400' icon={'carbon:close-filled'} width={30} height={30} />
      </Box>

      <NavSidebar navConfig={adminNavbarLinks} />
    </Drawer>
  );
}

type LinkProps = {
  route: string;
  text: string;
  setIsOpen: (isOpen: boolean) => void;
};

function LinkToPage({ route = '', text = '', setIsOpen }: LinkProps) {
  return (
    <Link href={route} passHref>
      <Text onClick={() => setIsOpen(false)} className='mx-3 hover:opacity-95 my-10 text-xl' component='a'>
        {text}
      </Text>
    </Link>
  );
}
