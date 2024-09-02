import {
	HandPointing,
	Image,
	Keyboard,
	Rectangle,
	Table,
	TextH,
} from '@phosphor-icons/react'
import {EHTMLTag} from '../types/EHTMLTag'
import {ISidebarComponent} from './../types/ISidebarComponent'
export const sidebarComponents: ISidebarComponent[] = [
	{type: EHTMLTag.FORM, icon: Table},
	{type: EHTMLTag.DIV, icon: Rectangle},
	{type: EHTMLTag.HEADING, icon: TextH},
	{type: EHTMLTag.INPUT, icon: Keyboard},
	{type: EHTMLTag.BUTTON, icon: HandPointing},
	{type: EHTMLTag.IMG, icon: Image},
] as const
