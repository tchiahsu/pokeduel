type ImageItem = {
    src: string;
    alt: string;
    note?: string;
}

type ContentItem = {
    description: string;
    bullet?: string[];
    image: ImageItem;
}

type SectionProps = {
    title: string;
    content: ContentItem[];
}

const Section = ({ title, content }: SectionProps) => {
    return (
    <section className="flex flex-col gap-4 w-full max-w-2/3 rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur p-6 shadow-md">
        {/* Section Title */}
        <h2 className="text-xl font-semibold">{title}</h2>

        {content.map((content, index) => {
            return (
                <div className="flex flex-col w-full">
                    <div key={index} className="grid grid-cols-1 mb-8">
                        <figure className="flex flex-col items-center">
                        <img
                            src={content.image.src}
                            alt={content.image.alt}
                            className="w-full max-w-xl rounded-xl shadow-md ring-1 ring-gray-200"
                            loading="lazy"
                        />
                        <figcaption className="mt-2 text-xs text-gray-400 text-center">{content.image.alt}</figcaption>
                        </figure>
                    </div>

                    <div className="text-xs text-gray-600 text-left">
                        {content.description}

                        {content.bullet?.length ? (
                            <ul className="list-disc list-outside pl-5 space-y-1.5 text-xs marker:text-gray-400 mt-3">
                                {content.bullet.map((item, index) => (
                                    <li key={`${index}-${item}`} className="list-item">{item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div> 
                </div>        
        )})}
    </section>
    );
};

export default Section