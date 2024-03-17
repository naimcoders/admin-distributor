import { Tab, Tabs as TabWrapper } from "@nextui-org/react";
import { Color } from "src/types";

export interface ITabs {
  label: string;
  content: React.ReactNode;
}

function Tabs(props: {
  items: ITabs[];
  color: Color;
  selectedKey: string;
  onSelectionChange: (key: React.Key) => void;
}) {
  return (
    <TabWrapper
      aria-label="Dynamic tabs"
      items={props.items}
      color={props.color}
      variant="solid"
      classNames={{
        tab: "w-32 text-sm",
      }}
      size="lg"
      radius="sm"
      selectedKey={props.selectedKey}
      onSelectionChange={props.onSelectionChange}
    >
      {(item) => (
        <Tab key={item.label} title={item.label} className="capitalize">
          {item.content}
        </Tab>
      )}
    </TabWrapper>
  );
}

export default Tabs;
