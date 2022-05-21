import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import AntiFocusTrap from "@components/AntiFocusTrap/AntiFocusTrap";
import Stack from "@components/Form/Stack/Stack";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import { FormEvent, useEffect, useState } from "react";
import Form from "@components/Form/Form/Form";
import Button from "@components/Form/Buttons/Button";
import { gqlClient } from "@libs/graphql-request";
import { gql } from "graphql-request";
interface props extends preMadeDialogNeeded {
  onSuccess: () => void;
}

const createPriorityMutation = gql`
  mutation ($name: String!, $color: String!, $order: Int!) {
    createPriority(name: $name, color: $color, order: $order) {
      priority_id
    }
  }
`;

export default function CreatePriorityDialog({
  isOpen,
  onClose,
  onSuccess,
}: props) {
  const [PriorityName, setPriorityName] = useState<string>("");
  const [PriorityColor, setPriorityColor] = useState<string>("#000000");
  const [PriorityOrder, setPriorityOrder] = useState<string>("0");
  const [Error, setError] = useState<string>("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (
      parseInt(PriorityOrder) < 0 ||
      parseInt(PriorityOrder) > 999 ||
      PriorityName === "" ||
      PriorityName.length < 1 ||
      PriorityColor.length < 1
    ) {
      return;
    }
    gqlClient
      .request(createPriorityMutation, {
        name: PriorityName,
        color: PriorityColor,
        order: parseInt(PriorityOrder),
      })
      .then((res) => {
        if (res.createPriority) {
          if (res.createPriority.priority_id) {
            onSuccess();
            onClose();
          }
        }
      })
      .then((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (parseInt(PriorityOrder) > 999) {
      setPriorityOrder("999");
    }
    if (parseInt(PriorityOrder) < 0) {
      setPriorityOrder("0");
    }
  }, [PriorityOrder]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <AntiFocusTrap pos={{ x: -20, y: -20 }} />
        <Stack type="col">
          <Stack type="row" className="mb-4">
            <div className="text-xl font-semibold">Criar Prioridade</div>
          </Stack>
          {/* Wrapper */}
          <Form className="space-y-3" method="POST" onSubmit={handleSubmit}>
            <InputGroup>
              <Label text="Nome" />
              <Input
                input={{
                  type: "text",
                  name: "name",
                  placeholder: "Nome da Prioridade",
                  required: true,
                  onChange: (e) => setPriorityName(e.target.value),
                  value: PriorityName,
                }}
              />
            </InputGroup>
            <InputGroup>
              <Label text="Cor" />
              <Input
                input={{
                  type: "color",
                  name: "name",
                  placeholder: "Nome da Prioridade",
                  required: true,
                  onChange: (e) => setPriorityColor(e.target.value),
                  value: PriorityColor,
                }}
              />
            </InputGroup>
            <InputGroup>
              <Stack type="row" className="items-center">
                <Label text="Prioridade" />
                <span className="ml-1 text-black text-opacity-60">{`(0-999)`}</span>
              </Stack>
              <Input
                input={{
                  type: "number",
                  max: 999,
                  min: 0,
                  name: "name",
                  placeholder: "Prioridade",
                  required: true,
                  onChange: (e) => setPriorityOrder(e.target.value),
                  value: PriorityOrder,
                }}
              />
            </InputGroup>
            <Button type="submit" className="mt-4">
              Criar
            </Button>
          </Form>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
