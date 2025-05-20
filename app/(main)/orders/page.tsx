"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Image as ChakraImage,
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "next/image";

type Orders = {
  id: string;
  itens: {
    name: string;
    path: string;
  }[];
  time: string;
  nomeDoCliente: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [readyOrders, setReadyOrders] = useState<Orders[]>([]);

  async function removeFromFirebase(id: string) {
    const ref = doc(db, "pedidos", id);
    await deleteDoc(ref);
  }

  useEffect(() => {
    async function searchOrders() {
      const pedidosRef = collection(db, "pedidos");
      const snapshot = await getDocs(pedidosRef);

      const lista: Orders[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          itens: data.itens,
          time: data.time,
          nomeDoCliente: data.nomeDoCliente,
        };
      });

      setOrders(lista);

      lista.forEach((order, index) => {
        setTimeout(() => {
          setOrders((prev) => prev.filter((o) => o.id !== order.id));

          setReadyOrders((prev) => {
            const jaExiste = prev.find((o) => o.id === order.id);
            if (jaExiste) return prev;
            return [...prev, order];
          });

          removeFromFirebase(order.id);

          setTimeout(() => {
            setReadyOrders((prev) => prev.filter((o) => o.id !== order.id));
          }, 10000);
        }, 10000 + index * 2000);
      });
    }

    searchOrders();
  }, []);

  return (
    <Box bg="black" minH="100vh" p={6} color="white">
      <SimpleGrid columns={[1, null, 2]}>
        {/* Em produção */}
        <Box>
          <Heading size="md" mb={4}>
            Em produção
          </Heading>
          <SimpleGrid columns={2}>
            {orders.map((order) => (
              <Card.Root key={order.id} bg="gray.800" color="white">
                <CardBody>
                  <Text fontWeight="bold" mb={2}>
                    Pedido #{order.id}
                  </Text>
                  {order.itens.map((item, i) => (
                    <Box key={i} mb={2}>
                      <Text>{item.name}</Text>
                      <ChakraImage
                        src={item.path}
                        alt={item.name}
                        borderRadius="md"
                        boxSize="100px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </CardBody>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Prontos
          </Heading>
          <SimpleGrid>
            {readyOrders.map((order) => (
              <Card.Root
                key={order.id}
                border="2px solid"
                borderColor="green.500"
                bg="gray.700"
                color="white"
              >
                <CardBody>
                  <Text fontWeight="bold" mb={2}>
                    {order.nomeDoCliente}
                  </Text>
                  {order.itens.map((item, i) => (
                    <Box key={i} mb={2}>
                      <Text>{item.name}</Text>
                      <ChakraImage
                        src={item.path}
                        alt={item.name}
                        borderRadius="md"
                        boxSize="100px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </CardBody>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
