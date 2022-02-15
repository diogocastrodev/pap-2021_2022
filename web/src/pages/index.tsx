import SmallSection from "../components/Sections/SmallSection";
import SectionList from "../components/Sections/SectionList";
import BigSection from "../components/Sections/BigSection";
import { dummyData, dummyData2 } from "../dummies/SectionDummyData";
export default function indexPage() {
  return (
    <div className="px-16 py-16">
      <SectionList>
        <SmallSection />
        <SmallSection />
        <SmallSection />
        <SmallSection />
        <SmallSection />
      </SectionList>
      <div className="pt-16" />
      <BigSection sectionProps={dummyData} />

      <div className="py-4" />
      <BigSection sectionProps={dummyData2} />
    </div>
  );
}
