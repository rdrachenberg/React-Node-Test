import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState, useCallback } from 'react'

import { Link, useParams } from 'react-router-dom'
import { getApi } from 'services/api'
// import DeleteTask from './components/deleteTask'
import { useNavigate } from 'react-router-dom';
import { HasAccess } from "../../../redux/accessUtils";

const MeetingView = (props) => {
    const { onClose, isOpen, access } = props
    const { id } = useParams()
    const [data, setData] = useState();
    const [, setEdit] = useState(false);
    const [, setDelete] = useState(false);
    // const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    
    const fetchViewData = useCallback(async () => {
        setIsLoding(true);
        // console.log(`id: ${id}`)
        try {
        const result = await getApi(`api/meeting/${id}`);
        // console.log(result);
            if (!result?.data || result.status !== 200) {
                navigate('/default');
            } else {
                setData(result.data);
            }
        } catch (error) {
            console.log(`error: ${error}`)
        navigate('/default');
        } finally {
            setIsLoding(false);
        }
    },[id, navigate])

    useEffect(() => {
        fetchViewData();
    }, [id, fetchViewData])

    const [contactAccess, leadAccess] = HasAccess(['Contacts', 'Leads'])

    const handleViewOpen = () => {
        if (id) {
            navigate(`meeting/${id}`)
        }
        else {
            navigate(`meeting/${id}`)
        }
    }
    return (
        <Modal isOpen={ typeof isOpen === 'boolean' ? isOpen : true } size={'md'} isCentered >
            <ModalOverlay />
            <ModalContent height={"70%"}>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Meeting
                    <IconButton onClick={() => {
                        if (typeof onClose === 'function') {
                            onClose(false);
                        } else {
                            navigate('/meeting'); // 
                        }
                        }} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody overflowY={"auto"}>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Agenda </Text>
                                    <Text>{data?.agenda ? data?.agenda : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Date&Time  </Text>
                                    <Text>{data?.dateTime ? moment(data?.dateTime).format('lll ') : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created By </Text>
                                    <Text>{data?.createdByName ? data?.createdByName : '-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Related </Text>
                                    <Text>{data?.related ? data?.related : '-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Location </Text>
                                    <Text>{data?.location ? data?.location : '-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Notes </Text>
                                    <Text>{data?.notes ? data?.notes : '-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> attendes </Text>
                                    {data?.related === 'Contact' && contactAccess?.view ? data?.attendes && data?.attendes.map((item) => {
                                        return (
                                            <Link to={`/contactView/${item._id}`}>
                                                <Text color='brand.600' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.firstName + ' ' + item.lastName}</Text>
                                            </Link>
                                        )
                                    }) : data?.related === 'Lead' && leadAccess?.view ? data?.attendesLead && data?.attendesLead.map((item) => {
                                        return (
                                            <Link to={`/leadView/${item._id}`}>
                                                <Text color='brand.600' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.leadName}</Text>
                                            </Link>
                                        )
                                    }) : data?.related === 'Contact' ? data?.attendes && data?.attendes.map((item) => {
                                        return (
                                            <Text color='blackAlpha.900' >{item.firstName + ' ' + item.lastName}</Text>
                                        )
                                    }) : data?.related === 'Lead' ? data?.attendesLead && data?.attendesLead.map((item) => {
                                        return (
                                            <Text color='blackAlpha.900' >{item.leadName}</Text>
                                        )
                                    }) : '-'}
                                </GridItem>
                            </Grid>
                        </ModalBody>
                        <DrawerFooter>
                            {access?.view && <IconButton variant='outline' colorScheme={'green'} onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />}
                            {access?.update && <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />}
                            {access?.delete && <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />}

                            {/* 
                            <DeleteTask fetchData={props.fetchData} isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={info?.event ? info?.event?.id : info} /> */}
                        </DrawerFooter>
                    </>}
            </ModalContent>
        </Modal>
    )
}

export default MeetingView
