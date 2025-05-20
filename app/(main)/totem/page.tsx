"use client";

import { useState } from "react";
import items from "@/data/items.json";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Input,
  CloseButton,
  Stack,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

type Item = {
  id: number;
  name: string;
  price: string;
  description: string;
  path: string;
};

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [cart, setCart] = useState<Item[]>([]);
  const [clientName, setClientName] = useState("");
  const router = useRouter();

  const handleAddToCart = (item: Item) => {
    if (cart.length > 5) {
      toaster.create({
        title: "Você atingiu o limite de itens no carrinho.",
      });
      return;
    }

    setCart((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const enviarPedido = async () => {
    if (cart.length === 0) return;

    if (clientName.length < 2) {
      toaster.create({
        title: "Insira um nome com dois ou mais caracteres.",
      });
      return;
    }

    const pedido = {
      itens: cart,
      criadoEm: Timestamp.now(),
      nomeDoCliente: clientName,
    };

    try {
      await addDoc(collection(db, "pedidos"), pedido);
      setCart([]);
      setSelectedItem(null);
      router.push("/orders");
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
    }
  };

  return (
    <Box p={6} bg="gray.900" minH="100vh" color="white">
      <Toaster />

      <Stack direction={["column", null, "row"]}>
        <Box flex="2">
          <SimpleGrid columns={[1, 2]}>
            {items.map((burger: Item) => (
              <Card.Root
                key={burger.id}
                bg="gray.800"
                color="white"
                borderRadius="xl"
                overflow="hidden"
                shadow="md"
              >
                <Image src={burger.path} alt={burger.name} />

                <CardBody>
                  <Heading size="md" mb={2}>
                    {burger.name}
                  </Heading>
                  <Text fontSize="sm" mb={2}>
                    {burger.description}
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    R${burger.price}
                  </Text>
                </CardBody>

                <CardFooter>
                  <Button
                    colorScheme="teal"
                    onClick={() => handleAddToCart(burger)}
                  >
                    Adicionar
                  </Button>
                </CardFooter>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>

        <Box
          flex="1"
          bg="gray.800"
          p={4}
          borderRadius="lg"
          boxShadow="base"
          color="white"
        >
          {cart.length > 0 && (
            <>
              <Heading size="md" mb={4}>
                Carrinho ({cart.length})
              </Heading>

              <Stack>
                {cart.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="md"
                    p={3}
                    bg="gray.700"
                  >
                    <Stack direction="row" align="center">
                      <Image
                        src={item.path}
                        alt={item.name}
                        boxSize="50px"
                        borderRadius="md"
                        objectFit="cover"
                      />
                      <Text fontWeight="medium">{item.name}</Text>
                    </Stack>
                    <CloseButton
                      onClick={() => handleRemoveFromCart(index)}
                      color="white"
                    />
                  </Box>
                ))}
              </Stack>

              <Stack mt={6}>
                <Input
                  placeholder="Insira o seu nome"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  bg="gray.600"
                  color="white"
                  _placeholder={{ color: "gray.300" }}
                  borderColor="gray.500"
                />
                <Button colorScheme="blue" onClick={enviarPedido}>
                  Enviar Pedido
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
