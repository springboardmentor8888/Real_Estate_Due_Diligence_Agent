package com.realestate.agent.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.core.Ordered;
import org.springframework.core.PriorityOrdered;
import org.springframework.stereotype.Component;

/**
 * BeanPostProcessor that acts as an additional safeguard to ensure DataSourceProperties
 * and HikariDataSource have a valid JDBC PostgreSQL URL before connections are established.
 */
@Component
public class DatabaseUrlNormalizationBeanPostProcessor implements BeanPostProcessor, PriorityOrdered {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlNormalizationBeanPostProcessor.class);

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSourceProperties properties) {
            String url = properties.getUrl();
            if (url != null) {
                String normalized = DatabaseUrlNormalizer.normalize(url);
                if (!url.equals(normalized)) {
                    log.info("DatabaseUrlNormalizationBeanPostProcessor: Normalizing DataSourceProperties url to '{}'", normalized);
                    properties.setUrl(normalized);
                }
            }
        }
        return bean;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
