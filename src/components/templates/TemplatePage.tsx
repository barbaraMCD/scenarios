import Navigation from '../organisms/Navigation.tsx'
import type {ReactNode} from "react";

interface TemplatePageProps {
    children: ReactNode
}

const TemplatePage = ({children}: TemplatePageProps) => {
    return (
        <div className="min-h-screen min-w-screen bg-gray-50 p-4">
            <Navigation />
            <main>
                {children}
            </main>
        </div>
    )
}

export default TemplatePage
