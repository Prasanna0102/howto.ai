import React from "react";
import { Guide, GuideSection, GuideContent as GuideContentType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import InlineAdUnit from "./InlineAdUnit";

interface GuideContentProps {
  guide: Guide;
  onShare: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

const GuideContent: React.FC<GuideContentProps> = ({ 
  guide, 
  onShare, 
  onPrint, 
  onDownload 
}) => {
  const { title, content, createdAt } = guide;
  // Ensure content has proper type structure and remove any potential data attributes
  const sections = (content && typeof content === 'object' && 'sections' in content) 
    ? (content as GuideContentType).sections 
    : [];
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Sample related guides (in a real app, these would be fetched from the backend)
  const relatedGuides = [
    {
      title: `Troubleshooting common problems with ${title.split(' ').slice(-1)}`,
      slug: '#',
      readTime: '5 min'
    },
    {
      title: `Advanced techniques for ${title.split(' ').slice(-1)}`,
      slug: '#',
      readTime: '4 min'
    }
  ];

  // Function to insert ads after specific sections
  const renderSectionsWithAds = () => {
    return sections.map((section: GuideSection, index: number) => {
      const isAdPosition = (index + 1) % 2 === 0 && index !== sections.length - 1;
      
      return (
        <React.Fragment key={index}>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            
            {section.type === "list" ? (
              <ul className="list-disc pl-5 space-y-2">
                {section.items?.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            ) : (
              <div>
                {section.content?.map((paragraph: string, paragraphIndex: number) => (
                  <p key={paragraphIndex} className={paragraphIndex < section.content.length - 1 ? "mb-3" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          {/* Insert ad unit after every second section */}
          {isAdPosition && <InlineAdUnit />}
        </React.Fragment>
      );
    });
  };

  return (
    <article className="lg:w-3/4">
      <div className="bg-secondary/20 border border-gray-800 rounded-lg p-6 mb-6">
        {/* Guide Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h1>
          <div className="flex items-center text-sm text-gray-400">
            <time dateTime={new Date(createdAt).toISOString()}>
              Generated on {formattedDate}
            </time>
            <span className="mx-2">•</span>
            <span>By HowTo.AI</span>
          </div>
        </header>
        
        {/* Guide Content with interspersed ads */}
        <div className="prose prose-invert max-w-none">
          {renderSectionsWithAds()}
        </div>
        
        {/* Guide Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button 
            variant="secondary" 
            onClick={onShare}
            className="flex items-center gap-2"
            aria-label="Share guide"
          >
            <i className="fas fa-share-alt"></i>
            <span>Share</span>
          </Button>
          <Button 
            variant="secondary" 
            onClick={onPrint}
            className="flex items-center gap-2"
            aria-label="Print guide"
          >
            <i className="fas fa-print"></i>
            <span>Print</span>
          </Button>
          <Button 
            onClick={onDownload}
            className="flex items-center gap-2 bg-primary hover:bg-primary/80"
            aria-label="Download guide as PDF"
          >
            <i className="fas fa-file-pdf"></i>
            <span>Download PDF</span>
          </Button>
        </div>
      </div>
      
      {/* Related Guides */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedGuides.map((relatedGuide, index) => (
            <Link href={relatedGuide.slug} key={index}>
              <div className="block bg-secondary/20 border border-gray-800 p-4 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <h3 className="font-medium mb-1">{relatedGuide.title}</h3>
                <p className="text-sm text-gray-400">{relatedGuide.readTime} read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};

export default GuideContent;
