import { Button, Card } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center flex-col items-center">
      <Card.Root size="lg" bgColor="whiteAlpha.300">
        <Card.Body>
          <Card.Title mb="4">
            BurgerTown
            <Image
              src="/Logo.png"
              alt="BurgertownLogo"
              width={100}
              height={100}
            />
          </Card.Title>
          <Card.Description>
            Esta aplicação simula um totem encontrado em estabelecimentos de
            fast-food, como Burger King e McDonald's. Ela contará com duas
            telas: – A tela do totem, onde o cliente faz o pedido; – E uma
            segunda tela dividida em duas partes: À esquerda, onde o chapeiro
            visualiza os pedidos; À direita, onde os clientes acompanham quando
            seus pedidos ficam prontos.
          </Card.Description>
        </Card.Body>
      </Card.Root>

      <Link href="/totem">
        <Button bgColor="green.500" mt="12">
          Começar meu pedido
        </Button>
      </Link>
    </div>
  );
}
