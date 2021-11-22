
namespace EntityViewer {

    const WINDOW_CLASS = 'devtools.window.entityviewer';
    const TOOL_ID = 'devtools.tool.entityviewer';

    const itemsList = [
        "Balloon",
        "Toy",
        "Map",
        "Photo",
        "Umbrella",
        "Drink",
        "Burger",
        "Chips",
        "IceCream",
        "Candyfloss",
        "EmptyCan",
        "Rubbish",
        "EmptyBurgerBox",
        "Pizza",
        "Voucher",
        "Popcorn",
        "HotDog",
        "Tentacle",
        "Hat",
        "ToffeeApple",
        "TShirt",
        "Doughnut",
        "Coffee",
        "EmptyCup",
        "Chicken",
        "Lemonade",
        "EmptyBox",
        "EmptyBottle",
        "unknown",
        "unknown",
        "unknown",
        "Admission",
        "Photo2",
        "Photo3",
        "Photo4",
        "Pretzel",
        "Chocolate",
        "IcedTea",
        "FunnelCake",
        "Sunglasses",
        "BeefNoodles",
        "FriedRiceNoodles",
        "WontonSoup",
        "MeatballSoup",
        "FruitJuice",
        "SoybeanMilk",
        "Sujeonggwa",
        "SubSandwich",
        "Cookie",
        "EmptyBowlRed",
        "EmptyDrinkCarton",
        "EmptyJuiceCup",
        "RoastSausage",
        "EmptyBowlBlue",
        "unknown",
        "unknown",
        "Count"
    ] as string[];

    const voucherList = [
        "Free Park Entry",
        "Free Ride",
        "Park Entry Half Price",
        "Free Food or Drink"
    ] as string[];

    const peepStateList = [
        "Falling",
        "One",
        "QueuingFront",
        "OnRide",
        "LeavingRide",
        "Walking",
        "Queuing",
        "EnteringRide",
        "Sitting",
        "Picked",
        "Patrolling",
        "Mowing",
        "Sweeping",
        "EnteringPark",
        "LeavingPark",
        "Answering",
        "Fixing",
        "Buying",
        "Watching",
        "EmptyingBin",
        "UsingBin",
        "Watering",
        "HeadingToInspection",
        "Inspecting"
    ] as string[];

    var entityId: number;
    var guest: Guest;
    var guestinv: String[];

    export function register() {
        ui.registerMenuItem('Entity Viewer', () => {
            ui.activateTool({
                id: TOOL_ID,
                cursor: "cross_hair",
                onDown: e => {
                    if (e.entityId && map.getEntity(e.entityId).type == "guest") {
                        getOrOpen(e.entityId);
                    }
                }
            });
        });
    }

    function getOrOpen(id: number) {
        entityId = id;
        guest = map.getEntity(id) as Guest
        const w = ui.getWindow(WINDOW_CLASS);
        if (w) {
            w.bringToFront();
        } else {
            open();
        }
    }

    function open() {
        const e = map.getEntity(entityId) as Guest
        const window = ui.openWindow({
            classification: WINDOW_CLASS,
            title: '',
            width: 350,
            height: 500,
            minWidth: 300,
            minHeight: 300,
            maxWidth: 500,
            maxHeight: 1200,
            widgets: [
                {
                    type: "listview",
                    name: "rve-debug-list",
                    scrollbars: "both",
                    columns: [
                        {
                            width: 130
                        },
                        {
                        }
                    ],
                    isStriped: true,
                    canSelect: true,
                    x: 5,
                    y: 40,
                    width: 290,
                    height: 575,
                    onClick: (i, c) => console.log(`Clicked item ${i} in column ${c}`)
                },
                {
                    type: "dropdown",
                    name: "guestsender",
                    x: 5,
                    y: 18,
                    width: 200,
                    height: 20,
                    selectedIndex: (e.headingToRideId && map.getRide(e.headingToRideId) ? e.headingToRideId : 0),
                    onChange: ((i): number => e.headingToRideId = i)
                },
            ],
            onClose: () => onClose(),
            onUpdate: () => onUpdate()
        });

        function onClose() {
            const tool = ui.tool;
            if (tool && tool.id == TOOL_ID) {
                tool.cancel();
            }
        }

        function onUpdate() {
            updateInfo();
        }

        function set(items: ListViewItem[], guest: Guest) {
            const list = window.findWidget<ListViewWidget>("rve-debug-list");
            list.width = window.width - 10;
            list.height = window.height - 36;
            list.items = items;
            const dropdown = window.findWidget<DropdownWidget>("guestsender");
            dropdown.items = map.rides.map(ride => `${ride.name} - id ${ride.id}`); 
            
        }

        function updateInfo() {
            window.title = `Entity Viewer: #${entityId}`;

            const entity = map.getEntity(entityId);
            if (!entity) {
                set([["Guest does not exist anymore.", ""]], entity);
                return;
            }

            const sep = (text: string) => <ListViewItemSeperator>{ type: 'seperator', text };

            let data: ListViewItem[] = [
                sep('Entity'),
                ["Id:", entity.id.toString()],
                ["Type:", entity.type.toString()],
                ["Position:", `${entity.x}, ${entity.y}, ${entity.z}`]
            ];
            guest = entity as Guest;
            guestinv = []
            for (let i = 0; i < guest.inventory.length; i++)
                {
                    if (guest.inventory[i] == 255)
                    {
                        guestinv.push("None");
                    }
                    else
                    {
                        guestinv.push(itemsList[guest.inventory[i]]);
                    }
                }
            data = data.concat([
                sep('Peep'),
                ["Name", guest.name],
                ["Location", `x: ${Math.floor(guest.x/32)}, y: ${Math.floor(guest.y/32)}, z: ${Math.floor(guest.z/32)}`],
                ["Destination", `x: ${Math.floor(guest.destination.x/32), Math.floor(guest.destination.y/32)}`],
                ["Energy", guest.energy.toString()],
                ["Energy target", guest.energyTarget.toString()],
                ["",""],
                sep('Guest'),
                ["Guest happiness", guest.happiness.toString()],
                ["Guest happiness target", guest.happinessTarget.toString()],
                ["Guest nausea", guest.nausea.toString()],
                ["Guest nausea target", guest.nauseaTarget.toString()],
                ["Guest mass (Lbs)", (Math.round(guest.mass * 2.2).toString())],
                ["Guest heading to ride ID", `${guest.headingToRideId}`],
                ["Guest heading to ride name", `${(map.getRide(guest.headingToRideId) ? map.getRide(guest.headingToRideId).name : "None")}`],
                ["Guest inventory", guestinv.join()],
                ["Guest previous ride", `${(map.getRide(guest.previousRide) ? map.getRide(guest.previousRide).name : "None")}`],
                ["Guest current ride", `${map.getRide(guest.currentRide) ? map.getRide(guest.currentRide).name : "None"}`],
                ["Guest interacting ride", `${map.getRide(guest.interactionRide) ? map.getRide(guest.interactionRide).name : "None"}`],
                ["Guest CurrentRideStation", `${guest.currentRideStation != null ? guest.currentRideStation.toString() : "Undefined"}`],
                ["Guest ride queue time", map.getRide(guest.interactionRide) ? map.getRide(guest.interactionRide).stations[guest.currentRideStation].queueTime.toString() : "None"],
                ["Guest ride queue length", map.getRide(guest.interactionRide) ? map.getRide(guest.interactionRide).stations[guest.currentRideStation].queueLength.toString() : "None"],
                ["Guest PeepState", `${guest.peepState} - ${peepStateList[guest.peepState]}`],
                ["Guest Voucher Type", guest.voucherType != 255 && guest.inventory.indexOf(14) > -1 ? voucherList[guest.voucherType] : "None"],
                ["Guest Voucher Ride", guest.voucherId != null && guest.inventory.indexOf(14) > -1 ? (map.getRide(guest.voucherId) && guest.voucherType == 1 ? map.getRide(guest.voucherId).name : "None") : "None"],
                ["Guest Voucher Item", guest.voucherId != null && guest.inventory.indexOf(14) > -1 ? ( guest.voucherId != 255 && guest.voucherType == 3 ? itemsList[guest.voucherId] : "None") : "None"],
                ["Raw Voucher ID", guest.voucherId.toString()]
            ]);
            set(data, guest)
        }
    }
}