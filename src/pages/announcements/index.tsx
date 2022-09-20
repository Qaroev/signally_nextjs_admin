import { Box, Button, Container, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { Edit, Trash } from 'tabler-icons-react';
import Page from '../../components/others/Page';
import { BaseTable } from '../../components/tables/BaseTable';
import Layout from '../../layouts';
import { Announcement } from '../../models/model.announcement';
import { useAppSelector } from '../../models_store/_store';
import { fDateTimeSuffix } from '../../utils/formatTime';
import { apiDeleteAnnouncement } from '../../models_services/firestore_service';

export default function SignalsIndexPage() {
  function TableActions(id: string) {
    const router = useRouter();
    const modals = useModals();

    const handleDelete = async (modalId: string) => {
      modals.closeModal(modalId);
      try {
        await apiDeleteAnnouncement(id);
        showNotification({ title: 'Success', message: 'Announcement deleted', autoClose: 6000 });
      } catch (error) {
        showNotification({ color: 'red', title: 'Error', message: 'There was an error deleting the announcement', autoClose: 6000 });
      }
    };

    const openDeleteModal = () => {
      const modalId = modals.openModal({
        title: 'Are you sure you want to proceed?',
        centered: true,
        children: (
          <>
            <Text size='sm'>Delete this announcement? This action cannot be undone.</Text>
            <Box className='mt-6 flex justify-end'>
              <Button variant='outline' className='w-min mx-2' fullWidth onClick={() => modals.closeModal(modalId)} mt='md'>
                No don't delete it
              </Button>

              <Button className=' w-min btn-delete mx-2' fullWidth onClick={() => handleDelete(modalId)} mt='md'>
                Delete Announcement
              </Button>
            </Box>
          </>
        )
      });
    };

    return (
      <Box className='flex'>
        <Edit className='cursor-pointer text-yellow-400 mr-4' onClick={() => router.push(`/announcements/${id}`)} />{' '}
        <Trash className='cursor-pointer text-red-400' onClick={openDeleteModal} />
      </Box>
    );
  }

  const columns = React.useMemo<ColumnDef<Announcement>[]>(
    () => [
      {
        accessorKey: 'timestampCreated',
        header: () => <span>Created</span>,
        cell: (info) => fDateTimeSuffix(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'title',
        header: () => <span>Title</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'description',
        header: () => <span>Description</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'link',
        header: () => 'Link',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'imageUrl',
        header: () => <span>Image</span>,
        cell: (info) => (
          <Box>
            <img className='h-[50px] w-[100px]' src={`${info.getValue()}`} alt='' />
          </Box>
        ),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'id',
        header: 'Actions',
        cell: (info) => TableActions(info.getValue() as string),
        enableSorting: false,
        footer: (props) => props.column.id
      }
    ],
    []
  );

  const { announcements } = useAppSelector((state) => state.firestore);

  return (
    <Page title='Contact'>
      <Container size='xl' className=''>
        <Box className='flex text-center justify-between items-center mt-20 mb-20'>
          <Text className='text-4xl font-semibold leading-10'>Announcements</Text>
          <NextLink href='/announcements/create'>
            <Button type='submit' variant='white' className='btn bg-yellow-500'>
              New Announcement
            </Button>
          </NextLink>
        </Box>
        <BaseTable data={announcements} columns={columns} />
      </Container>
    </Page>
  );
}

SignalsIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='admin'>{page}</Layout>;
};
function apiGetAnnouncements() {
  throw new Error('Function not implemented.');
}
