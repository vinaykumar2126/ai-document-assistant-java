package com.example.ai_powered_document.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel; //Interface
import dev.langchain4j.model.embedding.EmbeddingModel; //Interface
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

// Correct Imports for Version 0.35.0
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel; // Implementation of Interface ChatLanguageModel
import dev.langchain4j.model.googleai.GoogleAiEmbeddingModel; // Implementation of Interface EmbeddingModel

@Configuration
public class VectorStoreConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return new InMemoryEmbeddingStore<>();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        // Use GoogleAiGeminiEmbeddingModel
        return GoogleAiEmbeddingModel.builder()
                .apiKey(this.apiKey)
                .modelName("text-embedding-004") // "embedding-001" is older; 004 is better
                .build();
    }

    @Bean
    public ChatLanguageModel chatModel() {
        // Use GoogleAiGeminiChatModel
        return GoogleAiGeminiChatModel.builder()
                .apiKey(this.apiKey)
                .modelName("gemini-1.5-flash") // "gemini-pro" is older; 1.5-flash is faster/cheaper
                .build();
    }
}