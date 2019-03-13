const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    return new Promise((resolve, reject) => {
        resolve(graphql(`
        {
            prismic{
              allHomepages(uid:"homepage"){
                edges{
                  node{
                    _meta{
                        uid
                        id
                        type
                    }
                    title
                    banner_image
                    banner_text
                    body {
                      __typename
                      ... on PRISMIC_HomepageBodyFeatured_items {
                        type
                        primary {
                          section_title
                          button_label
                          button_link{
                            __typename
                            ... on PRISMIC__ExternalLink {
                              url
                            }
                          }
                        }
                        fields {
                          link_to_product {
                            __typename
                            ... on PRISMIC_Product {
                              product_name
                              product_image
                              sub_title
                            }
                          }
                        }
                      }
                      ... on PRISMIC_HomepageBodyCta_banner {
                        type
                        primary {
                          image_banner
                          banner_title
                          banner_text
                          cta_label
                          cta_link {
                            __typename
                            ... on PRISMIC__ExternalLink {
                              url
                            }
                          }
                        }
                      }
                      ... on PRISMIC_HomepageBodyBig_bullet_item {
                        type
                        primary {
                          title_section
                        }
                        fields {
                          description_paragraph
                        }
                      }
                      ... on PRISMIC_HomepageBodySeparator {
                        type
                      }
                      ... on PRISMIC_HomepageBodyText_block {
                        type
                        primary {
                          title1
                          paragraph
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `).then(result => {
            if (result.errors) {
                reject(result.errors)
            }

            result.data.prismic.allHomepages.edges.forEach(({ node }) => {
                createPage({
                    path: `/`,
                    component: path.resolve(`./src/templates/homepage.js`),
                    context: {
                        data: node
                    },
                })
            })
        })
    )})
}