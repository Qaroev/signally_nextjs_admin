import { Box, Button, Container, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import Page from '../../components/others/Page';
import { BaseTable } from '../../components/tables/BaseTable';
import Layout from '../../layouts';
import { AuthUser } from '../../models/model.authuser';
import { apiUpdateUserLifetime } from '../../models_services/firestore_service';
import { useAppSelector } from '../../models_store/_store';
import { fDateTimeSuffix } from '../../utils/formatTime';

export default function SignalsIndexPage() {
  function TableActions(authUser: AuthUser) {
    const router = useRouter();
    const modals = useModals();

    const handleSubLifetime = async (modalId: string, authUser: AuthUser) => {
      modals.closeModal(modalId);
      try {
        await apiUpdateUserLifetime(authUser.id, !authUser.subIsLifetime);
        showNotification({ title: 'Success', message: 'User updated', autoClose: 6000 });
      } catch (error) {
        showNotification({ color: 'red', title: 'Error', message: 'User updated', autoClose: 6000 });
      }
    };

    const openSubLifetimeModal = () => {
      const modalId = modals.openModal({
        title: 'Are you sure you want to proceed?',
        centered: true,
        children: (
          <>
            <Text size='sm'>Yes, update the users lifetime subcription.</Text>
            <Box className='mt-6 flex justify-end'>
              <Button variant='outline' className='w-min mx-2' fullWidth onClick={() => modals.closeModal(modalId)} mt='md'>
                No don't do it
              </Button>

              <Button className=' w-min btn-delete mx-2' fullWidth onClick={() => handleSubLifetime(modalId, authUser)} mt='md'>
                {authUser.subIsLifetime ? 'Disable' : 'Enable'}
              </Button>
            </Box>
          </>
        )
      });
    };

    return (
      <Box className='flex'>
        <Button size='xs' onClick={openSubLifetimeModal} variant='outline'>
          {authUser.subIsLifetime ? 'Yes' : 'No'}
        </Button>
      </Box>
    );
  }

  const columns = React.useMemo<ColumnDef<AuthUser>[]>(
    () => [
      {
        accessorKey: 'email',
        header: () => <span>Email</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'name',
        header: () => <span>Username</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'timestampCreated',
        header: () => <span>Created</span>,
        cell: (info) => fDateTimeSuffix(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'timestampLastLogin',
        header: () => <span>Last Login</span>,
        cell: (info) => fDateTimeSuffix(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'subIsActive',
        header: () => 'Sub Active',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'subPeriodType',
        header: () => 'Sub Period Type',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'subLatestPurchaseDate',
        header: () => <span>Sub Latest Purchase Date</span>,
        cell: (info) => fDateTimeSuffix(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'subWillRenew',
        header: () => 'Sub Will Renew',
        footer: (props) => props.column.id
      },

      {
        accessorFn: (row: AuthUser) => `${row.id} ${row.subIsLifetime}`,
        id: 'actions',
        header: 'Sub Lifetime',
        cell: (info) => TableActions(info.row.original!)
      }
    ],
    []
  );

  const { authUsers } = useAppSelector((state) => state.firestore);

  return (
    <Page title='Contact'>
      <Container size='xl' className=''>
        <Box className='flex text-center justify-between items-center mt-20 mb-20'>
          <Text className='text-4xl font-semibold leading-10'>Users</Text>
          <NextLink href='/announcements/create'></NextLink>
        </Box>
        <BaseTable data={authUsers} columns={columns} />
      </Container>
    </Page>
  );
}

SignalsIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='admin'>{page}</Layout>;
};
