type Props = {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
    title?: string;
    subtitle?: string;
}

const Card = ({ children, className, title, subtitle }: Props)  => {
    return (
        <div className={`border-1 border-royal-blue-700/30 overflow-hidden bg-white p-6 rounded-2xl ${ className ?? "" }`}>
            { subtitle && <h3 className="text-sm uppercase font-medium text-royal-blue-700">{ subtitle }</h3> }
            { title && <h2 className={`text-xl text-royal-blue-950 ${ typeof children === "undefined" ? "" : "mb-4" }`}>{ title }</h2> }
            { children }
        </div>
    );
}

export default Card;