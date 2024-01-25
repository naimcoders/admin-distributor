import folderIcon from "src/assets/images/folder.png";
import { Switch } from "@nextui-org/react";

interface ISwitchAndFolder {
  id: number;
  isSuspendSelected: boolean;
  handleSwitch: () => void;
  handleFolder: () => void;
}

export const SwitchAndFolder = ({
  isSuspendSelected,
  handleFolder,
  handleSwitch,
  id,
}: ISwitchAndFolder) => {
  return (
    <section className="flex gap-4 justify-center items-center">
      <Switch
        aria-label="status account"
        color="success"
        onClick={handleSwitch}
        isSelected={isSuspendSelected}
        id={String(id)}
        name={String(id)}
        aria-labelledby={String(id)}
      />
      <img
        alt="folder"
        src={folderIcon}
        onClick={handleFolder}
        className="w-6 h-4 cursor-pointer"
      />
    </section>
  );
};
