import { Button, Card } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-white flex justify-center flex-col items-center break-keep">
      <Card.Root size="lg">
        <Card.Body>
          <Card.Title mb="4">
            BurgerTown{" "}
            <Image
              src="/Logo.png"
              alt="BurgertownLogo"
              width={100}
              height={100}
            />
          </Card.Title>
          <Card.Description>
            Essa aplicação simula um totem encontrado em estabelecimentos de
            Fast-Food como Burger King e McDonalds. Essa aplicação ira contar
            com 2 telas, a tela do totem, onde o cliente faz o pedido; <br />A
            tela que o Chapeiro do estabelecimento verá os pedidos em ordem;
            <br /> E a tela falando qual dos pedidos estão prontos.
          </Card.Description>
        </Card.Body>
      </Card.Root>

      <Link href="/totem">
        <Button bgColor="green.500" mt="2">
          Começar meu pedido
        </Button>
      </Link>
    </div>
  );
}
