import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import { Priority } from "@graphql/graphql";
import { useEffect, useState } from "react";
import Stack from "@components/Form/Stack/Stack";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";

interface props extends preMadeDialogNeeded {
  priority: Priority | undefined;
  onSuccess: () => void;
}

const updatePriority = gql`
  mutation updatePriority(
    $id: ID!
    $name: String
    $color: String
    $order: Int
  ) {
    updatePriority(id: $id, name: $name, color: $color, order: $order) {
      priority_id
      name
      color
      order
    }
  }
`;

export default function UpdatePriorityDialog({
  isOpen,
  onClose,
  priority,
  onSuccess,
}: props) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [order, setOrder] = useState<string>("0");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await gqlClient
      .request(updatePriority, {
        id: priority?.priority_id,
        name: name,
        color: color,
        order: parseInt(order),
      })
      .then((res) => {
        if (res.updatePriority) {
          if (res.updatePriority.priority_id) {
            onClose();
            onSuccess();
          }
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (priority) {
      setName(priority.name);
      setColor(priority.color);
      setOrder(priority.order.toString());
    }
  }, [priority]);

  useEffect(() => {
    if (parseInt(order) > 999) {
      setOrder("999");
    }
    if (parseInt(order) < 0) {
      setOrder("0");
    }
  }, [order]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col">
          <div className="mb-3 text-2xl font-semibold">
            Atualizar Prioridade
          </div>
          <Form onSubmit={handleSubmit}>
            <Stack type="col" className="space-y-2">
              <InputGroup>
                <Label text="Nome"></Label>
                <Input
                  input={{
                    type: "text",
                    value: name,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value);
                    },
                  }}
                ></Input>
              </InputGroup>
              <InputGroup>
                <Label text="Cor"></Label>
                <Input
                  input={{
                    type: "color",
                    value: color,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setColor(e.target.value);
                    },
                  }}
                ></Input>
              </InputGroup>
              <InputGroup>
                <Label text="Prioridade"></Label>
                <Input
                  input={{
                    type: "number",
                    value: order,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setOrder(e.target.value);
                    },
                  }}
                ></Input>
              </InputGroup>
              <Button type="submit">Atualizar</Button>
            </Stack>
          </Form>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
