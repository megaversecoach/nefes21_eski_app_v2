const Endpoints = {
  ContentCreatorsEndpoints: {
    Authors: {
      getPublishedAuthors: {
        method: 'get',
        url: '/authors?lang=tr'
      },
      getDraftedAuthors: {
        method: 'get',
        url: '/drafts/authors?lang=tr'
      },
      saveAsDraft: {
        method: 'post',
        url: '/drafts/authors'
      },
      publish: {
        method: 'post',
        url: '/authors'
      },
      delete: {
        method: 'delete',
        url: '/drafts/authors'
      }
    },
    Narrators: {
      getPublishedNarrators: {
        method: 'get',
        url: '/narrators?lang=tr'
      },
      getDraftedNarrators: {
        method: 'get',
        url: '/drafts/narrators?lang=tr'
      },
      saveAsDraft: {
        method: 'post',
        url: '/drafts/narrators'
      },
      publish: {
        method: 'post',
        url: '/narrators'
      },
      delete: {
        method: 'delete',
        url: '/drafts/narrators'
      }
    }
  },
  CardEndpoints: {
    getDecks: {
      method: 'get',
      url: '/decks?lang=tr'
    },
    getCards: {
      method: 'get',
      url: '/cards?lang=tr'
    },
    saveAndPublish: {
      method: 'post',
      url: '/cards'
    }
  },
  ContentEndpoints: {
    getPublishedContents: {
      method: 'get',
      url: '/contents?lang=tr'
    },
    getDraftedContents: {
      method: 'get',
      url: '/drafts/contents?lang=tr'
    },
    getContentTypes: {
      method: 'get',
      url: '/content-types?lang=tr'
    },
    saveAsDraft: {
      method: 'post',
      url: '/drafts/contents'
    },
    delete: {
      method: 'delete',
      url: '/drafts/contents'
    },
    getContentById: {
      method: 'get',
      url: '/drafts/contents'
    },
    publish: {
      method: 'post',
      url: '/contents'
    }
  },
  AuthEndpoints: {
    login: {
      method: 'post',
      url: `/login`
    }
  },
  UserEndpoints: {
    searchUser: {
      method: 'get',
      url: '/users'
    },
    searchTransaction: {
      method: 'get',
      url: '/transactions'
    },
    getUserExperience: {
      method: 'get',
      url: '/user-experience'
    },
    getSessionTokens: {
      method: 'get',
      url: '/session-tokens'
    },
    getSessions: {
      method: 'get',
      url: '/sessions'
    },
    getPurchaseEvents: {
      method: 'get',
      url: '/purchase-events'
    }
  },
  TrackEndpoints: {
    getPublishedTracksByContentId: {
      method: 'get',
      url: '/tracks?content_id='
    },
    getDraftedTracksByContentId: {
      method: 'get',
      url: '/drafts/tracks?content_id='
    },
    saveAsDraft: {
      method: 'post',
      url: '/drafts/tracks'
    },
    deleteTrack: {
      method: 'delete',
      url: '/drafts/tracks'
    }
  },
  TodayEndpoints: {
    getStarters: {
      method: 'get',
      url: '/today/starters?lang=tr'
    },
    saveStarters: {
      method: 'post',
      url: '/today/starters?lang=tr'
    },
    getSeriesPool: {
      method: 'get',
      url: '/today/series?lang=tr'
    },
    saveSeriesPool: {
      method: 'post',
      url: '/today/series'
    },
    getNonPersonalizedShowcases: {
      method: 'get',
      url: '/today/showcases/non-personalized?lang=tr'
    },
    getPersonalizedShowcasePool: {
      method: 'get',
      url: '/today/showcases/personalized?lang=tr'
    },
    savePersonalizedShowcasePool: {
      method: 'post',
      url: '/today/showcases/personalized'
    },
    saveNonPersonalized: {
      method: 'post',
      url: '/today/showcases/non-personalized'
    },
    deleteNonPersonalized: {
      method: 'delete',
      url: '/today/showcases/non-personalized'
    }
  },
  SoundscapeEndpoints: {
    getPublishedSoundscapes: {
      method: 'get',
      url: '/soundscapes?lang=tr'
    },
    getDraftedSoundscapes: {
      method: 'get',
      url: '/drafts/soundscapes?lang=tr'
    },
    saveAsDraft: {
      method: 'post',
      url: '/drafts/soundscapes'
    },
    publish: {
      method: 'post',
      url: '/soundscapes'
    },
    delete: {
      method: 'delete',
      url: '/drafts/soundscapes'
    }
  },
  ProgramEndpoints: {
    getPublishedPrograms: {
      method: 'get',
      url: '/programs?lang=tr'
    },
    getDraftedPrograms: {
      method: 'get',
      url: '/drafts/programs?lang=tr'
    },
    getDraftedProgramById: {
      method: 'get',
      url: '/drafts/programs/'
    },
    publishProgram: {
      method: 'post',
      url: '/programs'
    },
    saveProgramAsDraft: {
      method: 'post',
      url: '/drafts/programs'
    },
    deleteProgramFromDrafts: {
      method: 'delete',
      url: '/drafts/programs'
    },
    getProgramLayout: {
      method: 'get',
      url: '/layout/programs?lang=tr'
    },
    saveProgramLayout: {
      method: 'post',
      url: '/layout/programs?lang=tr'
    },
    getProgramLabels: {
      method: 'get',
      url: '/program-labels?lang=tr'
    }
  },
  ProductEndpoints: {
    getSuppliers: {
      method: 'get',
      url: '/suppliers'
    },
    getProducts: {
      method: 'get',
      url: '/products'
    },
    getPrepaidCodes: {
      method: 'get',
      url: '/codes/prepaid'
    },
    getPromoCodes: {
      method: 'get',
      url: '/codes/promo'
    },
    savePrepaidCode: {
      method: 'post',
      url: '/codes/prepaid'
    },
    refundPrepaidCode: {
      method: 'post',
      url: '/codes/prepaid/refund'
    },
    savePromoCode: {
      method: 'post',
      url: '/codes/promo'
    }
  },
  PartEndpoints: {
    getPublishedPartsByProgramId: {
      method: 'get',
      url: '/parts?program_id='
    },
    getDraftedPartsByProgramId: {
      method: 'get',
      url: '/drafts/parts?program_id='
    },
    savePartAsDraft: {
      method: 'post',
      url: '/drafts/parts'
    },
    deletePartFromDrafts: {
      method: 'delete',
      url: '/drafts/parts'
    }
  },

  LayoutEndpoints: {
    DimensionLayout: {
      getDimensions: {
        method: 'get',
        url: '/dimensions?lang=tr'
      },
      getDimensionLayout: {
        method: 'get',
        url: '/layout/dimension?lang=tr'
      },
      getDimensionCategories: {
        method: 'get',
        url: '/categories/dimension?lang=tr'
      },
      saveDimensionCategories: {
        method: 'post',
        url: '/categories/dimension'
      },
      getShowcaseType: {
        method: 'get',
        url: '/showcase-types?lang=tr'
      },
      save: {
        method: 'post',
        url: '/layout/dimension'
      }
    },
    QuickstartLayout: {
      getQuickStartLayout: {
        method: 'get',
        url: '/layout/quick-start?lang=tr'
      },
      getQuickStartCategories: {
        method: 'get',
        url: '/categories/quick-start?lang=tr'
      },
      save: {
        method: 'post',
        url: '/layout/quick-start'
      }
    },
    MooCheckInLayout: {
      getMoodCheckInLayout: {
        method: 'get',
        url: '/layout/mood-checkin?lang=tr'
      },
      save: {
        method: 'post',
        url: '/layout/mood-checkin'
      }
    }
  },

  SettingEndpoints: {
    getMaintenanceStates: {
      method: 'get',
      url:
        'https://nefes21-1613326670938-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json'
    },
    updateMaintenanceStates: {
      method: 'patch',
      url:
        'https://nefes21-1613326670938-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json'
    }
  }
}
export { Endpoints }
