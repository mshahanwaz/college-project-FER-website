import { ResponsivePie } from "@nivo/pie";

export default function PieChart({ data }) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      innerRadius={0.5}
      padAngle={3}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={5}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={1}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#000"
      arcLinkLabelsStraightLength={16}
    />
  );
}
