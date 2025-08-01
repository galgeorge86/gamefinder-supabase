import { statusArray } from "@/data/constants"
import { Select, SelectItem } from "@heroui/react"

const UserStatusSelect: React.FC = () => {
    return (
        <Select 
        variant="bordered"
        defaultSelectedKeys={["online"]} 
        items={statusArray}
        selectionMode="single"
        renderValue={(items) => items.map((item) => (
            <div key={item.key} className="flex flex-row gap-2 text-left">
                <div className={`w-2 h-2 rounded-full my-auto bg-${item.data?.color}`}/>
                <span>{item.data?.label}</span>
            </div>
        ))}
        className="flex w-full text-foreground min-w-[148px]" 
        radius="full">
            {(item) => (
                <SelectItem key={item.key}
                className="text-foreground"
                startContent={<div className={`flex w-2 h-2 bg-${item.color} rounded-full`}></div>}>
                        {item.label}
                </SelectItem>
            )}
        </Select>
    )
}

export default UserStatusSelect