/**
 * WhatsApp Formatting Utilities
 */
export function formatPropertiesForWhatsApp(properties, maxResults = 4) {
    if (properties.length === 0) {
        return "❌ Não encontrei imóveis com esses critérios. Que tal ajustar os filtros?";
    }
    const topResults = properties.slice(0, maxResults);
    const remaining = Math.max(0, properties.length - maxResults);
    let message = `✅ Encontrei ${properties.length} imóveis!\n\n`;
    message += `Aqui estão ${topResults.length} ${topResults.length > 1 ? "melhores opções" : "melhor opção"}:\n\n`;
    message += "━━━━━━━━━━━━━━━━━━━━\n\n";
    topResults.forEach((property, index) => {
        message += formatPropertyCard(property);
        if (index < topResults.length - 1) {
            message += "\n━━━━━━━━━━━━━━━━━━━━\n\n";
        }
    });
    if (remaining > 0) {
        message += `\n\n💡 Há mais ${remaining} ${remaining > 1 ? "imóveis disponíveis" : "imóvel disponível"}!\n`;
        message += "Quer refinar sua busca ou ver mais opções?";
    }
    return message;
}
export function formatPropertyDetailsForWhatsApp(property) {
    let message = `🏠 *${property.title}*\n\n`;
    message += `💰 *R$ ${(property.price / 1_000_000).toFixed(2)}mi* (R$ ${(property.pricePerSqm / 1000).toFixed(2)}k/m²)\n\n`;
    message += `📍 ${property.location}\n`;
    message += `   Balneário Camboriú\n\n`;
    message += `📊 ${property.bedrooms} dormitórios | ${property.suites} suítes | ${property.parkingSpots} vagas | ${property.totalArea}m² | ${property.floor}º andar\n\n`;
    if (property.view) {
        message += property.view === "ocean" ? "🌊 Vista Mar | " : "🏙️ Vista Cidade | ";
    }
    message += property.furnished ? "🛋️ Mobiliado\n\n" : "Sem mobília\n\n";
    if (property.amenities.length > 0) {
        const displayAmenities = property.amenities.slice(0, 3);
        message += `✨ ${displayAmenities.join(", ")}`;
        if (property.amenities.length > 3) {
            message += `\n   +${property.amenities.length - 3} mais`;
        }
        message += "\n\n";
    }
    message += `🔑 ID: ${property.id}`;
    return message;
}
function formatPropertyCard(property) {
    let card = `🏠 *${property.title}*\n\n`;
    card += `💰 *R$ ${(property.price / 1_000_000).toFixed(2)}mi*\n`;
    card += `📍 ${property.location}\n`;
    card += `📊 ${property.bedrooms} dorms | ${property.suites} suítes | ${property.totalArea}m²\n`;
    if (property.view === "ocean") {
        card += `🌊 Vista Mar\n`;
    }
    card += `🔑 ID: ${property.id}`;
    return card;
}
