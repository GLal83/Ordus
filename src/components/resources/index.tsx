'use client'

import { useState } from 'react'
import { Legislation } from './legislation'
import { Forms } from './forms'
import { Manuals } from './manuals'
import { Precedents } from './precedents'

export function Resources({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'resources-legislation':
      return <Legislation />
    case 'resources-forms':
      return <Forms />
    case 'resources-manuals':
      return <Manuals />
    case 'resources-precedents':
      return <Precedents />
    case 'resources-links':
      return <div>Useful Links</div>
    case 'resources-letters':
      return <div>Request Letters</div>
    case 'resources-caselaw':
      return <div>Case Law</div>
    default:
      return <div>Select a resource</div>
  }
}
