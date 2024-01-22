import folderIcon from "src/assets/images/folder.png";
import { Switch } from "@nextui-org/react";

interface ISwitchAndFolder {
  isSuspendSelected: boolean;
  handleSwitch: () => void;
  handleFolder: () => void;
}

export const SwitchAndFolder = ({
  isSuspendSelected,
  handleFolder,
  handleSwitch,
}: ISwitchAndFolder) => {
  return (
    <section className="flex gap-4 justify-center items-center">
      <Switch
        aria-label="status account"
        color="success"
        onClick={handleSwitch}
        isSelected={isSuspendSelected}
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
